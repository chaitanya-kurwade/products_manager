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
import { LoginResponse } from './users/responses/user-login.response.entity';
import { EmailserviceService } from 'apps/emailservice/src/emailservice.service';
import { VerificationService } from './verification/verification.service';
import { UserResponse } from './users/responses/user-response.entity';
import { ROLES } from './users/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailserviceService,
    private readonly verificationService: VerificationService,
  ) {}

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmailId(email);
    const pass = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return pass ? user : null;
  }

  async enterUsernameOrEmailOrPhoneNumberToLogin(
    credential: string,
    password: string,
  ): Promise<LoginResponse> {
    const user = await this.userService.enterUsernameOrEmailOrPhoneNumberToLogin(credential);
    if (!user) {
      throw new NotFoundException('user not found, please pass valid credentials');
    }
    return this.login(user.email, password);
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
      if (!user.isEmailVerified) {
        this.verificationService.sendEmailToVerifyEmail(user.email);
      }
      const { access_token, refresh_token } = await this.createTokens(user._id, user.email);
      return { access_token, refresh_token };
    }
  }

  async signup(signupUserInput: CreateUserInput): Promise<User> {
    const user = await this.userService.getUserToSignUp(signupUserInput.email);
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

  async signup(signupUserInput: CreateUserInput, role?: string): Promise<UserResponse> {
    const user = await this.userService.findOne(null, signupUserInput.email, null);

    if (user) {
      throw new BadRequestException('User email id already exists, kindly login');
    }
    // if (
    //   signupUserInput.role === undefined ||
    //   signupUserInput.role === null ||
    //   signupUserInput.role.length === 0
    // ) {
    const newRole = signupUserInput.role || ROLES.USER;

    const createUserInput = {
      ...signupUserInput,
      hashedRefreshToken: '',
      newRole,
    };
    if (role) {
      if (
        signupUserInput.role !== ROLES.SUPERADMIN &&
        signupUserInput.role !== ROLES.ADMIN &&
        signupUserInput.role !== ROLES.MANAGER &&
        signupUserInput.role !== ROLES.USER
      ) {
        throw new BadRequestException(`Please check the spelling ${signupUserInput.role}`);
      }
      if (role === ROLES.SUPERADMIN) {
        return await this.userService.createUser(createUserInput);
      } else if (role === ROLES.ADMIN) {
        if (newRole !== ROLES.MANAGER && newRole !== ROLES.USER) {
          console.log(newRole);
          throw new BadRequestException(`You cannot create ${newRole}`);
        }
        return await this.userService.createUser(createUserInput);
      } else if (role === ROLES.MANAGER) {
        if (newRole !== 'USER') {
          throw new BadRequestException(`You cannot create ${newRole}`);
        }
        return await this.userService.createUser(createUserInput);
      } else if (role === ROLES.USER) {
        throw new BadRequestException(`You dont have access to create ${newRole}`);
      }
    }
    // else {
    //   return await this.userService.createUser(createUserInput);
    // }

    // }
  }

  async getUserByAccessToken(access_token: string): Promise<User> {
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

  async storeRefreshToken(email: string, refreshToken: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const user = await this.userService.getUserByEmailId(email);
    return await this.userService.updateRefreshTokenFromUser(user.email, hashedRefreshToken);
  }

  async refreshAccessToken(refresh_token: string): Promise<string> {
    const payload = this.jwtService.decode(refresh_token);
    const { email } = payload;
    const user = await this.userService.getUserByEmailId(email);
    const refreshToken = await bcrypt.compare(refresh_token, user.hashedRefreshToken);
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

  // forget password
  async forgetPassword(email: string): Promise<any> {
    const user = await this.userService.getUserByEmailId(email);
    if (!user) {
      throw new NotFoundException(`user not found with ${email} email id`);
    }
    const userEmail = user.email;
    const userId = user._id;
    const payload = { email: userEmail, _id: userId };
    const reset_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_RESET_PASSWORD_EXPIRATION')}s`,
      // expiresIn: `10s`,
    });

    this.emailService.sendEmailToClient(email, reset_token);
  }

  // google login
  async googleLogin(req: { user: any }): Promise<any> {
    if (!req.user) {
      throw new Error('User not found!!!');
    }

    const payload = {
      email: req.user.email,
      firstName: req.user.firstName,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
    });
    console.log('access_token', access_token, '\n\n');

    const refresh_token = this.jwtService.sign(
      { ...payload, access_token },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION')}d`,
      },
    );
    console.log('refresh_token', refresh_token);
    const user = await this.userService.createUserViaGoogle({
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    });
    await this.storeRefreshToken(user.email, refresh_token);
    if (user) {
      return { user, access_token, refresh_token };
    } else {
      throw new NotFoundException('somthing is not good');
    }
  }

  // login with otp
  async loginViaOtpAndPhoneOrEmail(phoneOrEmail: string): Promise<string> {
    const user = await this.userService.getUserByPhoneOrEmailOrUsername(phoneOrEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userService.sendOtpToLogin(phoneOrEmail);
  }

  async validateOtp(otp: number): Promise<LoginResponse> {
    const user = await this.userService.validateOtp(otp);
    const tokens = await this.createTokens(user._id, user.email);
    console.log(user.email);
    return tokens;
  }

  // verify email
  async verifyEmail(token: string): Promise<string> {
    return this.verificationService.verifyEmail(token);
  }
}
