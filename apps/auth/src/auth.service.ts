import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from './users/inputs/create-user.input';
import { User } from './users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { EmailserviceService } from 'apps/emailservice/src/emailservice.service';
import { LoginResponse } from './users/responses/user-login.response.entity';
import { UserResponse } from './users/responses/user-response.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailserviceService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.userService.getUserByEmailId(email);
    const pass = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return pass ? user : null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userService.getUserByEmailId(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials : email not found');
    }
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials : wrong password');
      }
      const { access_token, refresh_token } = await this.createTokens(
        user._id,
        user.email,
        user.role,
      );

      const _id = user._id;
      const email = user.email;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const role = user.role;
      const createdAt = user.createdAt;
      const updatedAt = user.updatedAt;

      const userResponse: UserResponse = {
        _id,
        email,
        firstName,
        lastName,
        role,
        createdAt,
        updatedAt,
      };

      return { access_token, refresh_token, userResponse };
    }
  }

  async signup(signupUserInput: CreateUserInput): Promise<User> {
    const user = await this.userService.getUserByEmailId(signupUserInput.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const createUserInput = { ...signupUserInput, hashedRefreshToken: '' };
    return this.userService.createUser(createUserInput);
  }

  async getUserByAccessToken(access_token: string) {
    return await this.verify(access_token);
  }

  async verify(token: string): Promise<User> {
    const decoded = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user = await this.userService.getUserByEmailId(decoded.email);
    return user;
  }

  async createTokens(_id: string, email: string, role: string) {
    const payload = { email: email, _id: _id, role: role };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
    });
    const refresh_token = this.jwtService.sign(
      { ...payload, access_token },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION')}d`,
      },
    );
    await this.storeRefreshToken(email, refresh_token);
    return { access_token, refresh_token };
  }

  async storeRefreshToken(email: string, refreshToken: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const user = await this.userService.getUserByEmailId(email);
    return await this.userService.updateRefreshTokenFromUser(
      user.email,
      hashedRefreshToken,
    );
  }

  async refreshAccessToken(refresh_token: string): Promise<string> {
    const payload = this.jwtService.decode(refresh_token);
    const { email } = payload;
    const user = await this.userService.getUserByEmailId(email);
    const refreshToken = await bcrypt.compare(
      refresh_token,
      user.hashedRefreshToken,
    );
    console.log(refreshToken);
    if (refreshToken) {
      const payload = { email: user.email, _id: user._id, role: user.role };
      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
      });
      return access_token;
    }
  }

  // async forgetPassword(email: string) {
  //   const user = await this.userService.getUserByEmailId(email);
  //   if (!user) {
  //     throw new NotFoundException(`user not found with ${email} email id`);
  //   }
  //   const userEmail = user.email;
  //   const userId = user._id;
  //   const payload = { email: userEmail, _id: userId };
  //   const reset_token = this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_SECRET'),
  //     expiresIn: `${this.configService.get('JWT_RESET_PASSWORD_EXPIRATION')}s`,
  //     // expiresIn: `10s`,
  //   });

  //   this.emailService.sendEmailToClient(email, reset_token);
  // }
}
