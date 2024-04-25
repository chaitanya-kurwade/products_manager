import {
  BadRequestException,
  Inject,
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
import { UserResponse } from './users/responses/user-response.entity';
import { ROLES } from '../../../libs/library/src/enums/role.enum';
import { VERIFICATION_TYPE } from './users/enums/verification-type.enum';
import { LoginCredentialResponse } from './users/responses/login-credential.response.entity';
import { UpdateUserProfileInput } from './users/inputs/update-user-profile.input';
import { ClientProxy } from '@nestjs/microservices';
import { startCase, includes } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @Inject('emailservice') private emailClient: ClientProxy,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('customers') private readonly customerClient: ClientProxy,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.userService.getUserByEmailId(email);
    const pass = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return pass ? user : null;
  }

  // login
  async login(credential: string, passwordOrOtp?: string): Promise<LoginResponse> {
    const user = await this.findOneUserForLogin(credential);
    // const user = userWithLoginCredential.user;
    const userCredential = credential;
    const isEmail = await this.validateEmail(userCredential);
    const isPhoneNumber = await this.validatePhoneNumber(userCredential);

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials : ${credential} not found`);
    }

    if (!user && isPhoneNumber) {
      throw new NotFoundException('User not found, incorrect phone number: ' + userCredential);
    }

    if (!user && isEmail) {
      throw new NotFoundException('User not found, incorrect email: ' + userCredential);
    }

    if (!user && (!isEmail || !isPhoneNumber)) {
      throw new NotFoundException('User not found, incorrect username: ' + userCredential);
    }

    const _id = user._id;
    const email = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const role = user.role;
    const createdAt = user.createdAt;
    const updatedAt = user.updatedAt;
    const isEmailVerified = user.isEmailVerified;

    const userResponse: UserResponse = {
      _id,
      email,
      firstName,
      lastName,
      role,
      createdAt,
      updatedAt,
      isEmailVerified,
    };

    if (user.phoneNumber === credential) {
      const otp = passwordOrOtp || 1234;
      if (otp === '1234') {
        const { access_token, refresh_token } = await this.createTokens(
          user._id,
          user.email,
          user.role,
        );
        if (user.role === ROLES.USER) {
          this.customerClient.emit('user', user);
        }
        return { access_token, refresh_token, userResponse };
      }
    } else if (user.email === credential || user.username === credential) {
      const password = passwordOrOtp;
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials : wrong password');
      }
      const { access_token, refresh_token } = await this.createTokens(
        user._id,
        user.email,
        user.role,
      );
      if (user.role === ROLES.USER) {
        this.customerClient.emit('user', user);
      }
      return { access_token, refresh_token, userResponse };
    }
  }

  async enterCredentialToLogin(userCredential: string): Promise<LoginCredentialResponse> {
    const user = await this.userService.findOneUserForLogin(userCredential);
    const isEmail = await this.validateEmail(userCredential);
    const isPhoneNumber = await this.validatePhoneNumber(userCredential);

    if (!user && isPhoneNumber) {
      throw new NotFoundException('User not found, incorrect phone number: ' + userCredential);
    }

    if (!user && isEmail) {
      throw new NotFoundException('User not found, incorrect email id: ' + userCredential);
    }

    if (!user && (!isEmail || !isPhoneNumber)) {
      throw new NotFoundException('User not found, incorrect username: ' + userCredential);
    }

    if (!user.isEmailVerified && !user.password) {
      this.emailClient.emit('sendEmailToVerifyEmailAndCreatePassword', user);
      return {
        message: 'please verify email and generate password, mail sent on ' + user.email,
        type: VERIFICATION_TYPE.VERIFY,
      };
    }

    if (user) {
      if (!isEmail && !isPhoneNumber) {
        return {
          message: 'please enter password to login username: ' + userCredential,
          type: VERIFICATION_TYPE.PASSWORD,
        };
      } else if (isPhoneNumber) {
        return {
          message: 'please enter otp to login username: ' + userCredential,
          type: VERIFICATION_TYPE.OTP,
        };
      } else if (isEmail) {
        return {
          message: 'please enter password to login: ' + userCredential,
          type: VERIFICATION_TYPE.PASSWORD,
        };
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  // verify email
  // async verifyEmail(token: string): Promise<string> {
  //   return await firstValueFrom(this.emailClient.send('verifyEmail', token));
  //   // return this.verificationService.verifyEmail(token);
  // }

  // async enterPasswordToLogin(password: string) {
  //   return this.userService.enterPasswordToLogin(password);
  // }

  // async sendEmailToLogin(credential: string): Promise<string> {
  //   const userWithLoginCredential = await this.userService.getByUsernameOrPhoneOrEmail(credential);
  //   if (!userWithLoginCredential) {
  //     throw new UnauthorizedException(`Invalid credentials : ${credential} not found`);
  //   }
  //   if (!userWithLoginCredential.password) {
  //     this.verificationService.sendEmailToVerifyEmail(userWithLoginCredential.email);
  //   }
  //   if (userWithLoginCredential.password) {
  //   }
  //   return '';
  // }

  // findOneUserForLogin
  async findOneUserForLogin(userCredential?: string): Promise<User> {
    const userWithLoginCredential = await this.userService.findOneUserForLogin(userCredential);
    return userWithLoginCredential;
  }

  // validateEmail
  async validateEmail(email: string): Promise<boolean> {
    return this.userService.validateEmail(email);
  }

  // validatePhoneNumber
  async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    return this.userService.validatePhoneNumber(phoneNumber);
  }

  // createUser
  async createUser(createUserInput: CreateUserInput, role?: string): Promise<UserResponse> {
    const existingUser = await this.findOneUserForSignup(
      createUserInput?.username,
      createUserInput?.email,
      createUserInput?.phoneNumber,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    if (
      createUserInput?.phoneNumber &&
      existingUser &&
      createUserInput?.phoneNumber === existingUser?.phoneNumber
    ) {
      throw new BadRequestException('The phone number already exists');
    }
    if (createUserInput?.email === existingUser?.email) {
      throw new BadRequestException('The email already exists');
    }
    if (createUserInput?.username && createUserInput?.username === existingUser?.username) {
      throw new BadRequestException('The username already exists');
    }

    const newRole = createUserInput.role || ROLES.USER;

    const createUser = {
      ...createUserInput,
      email: createUserInput?.email.toLowerCase(),
      firstName: startCase(createUserInput?.firstName),
      lastName: startCase(createUserInput?.lastName),
      hashedRefreshToken: '',
      newRole,
    };

    if (role) {
      if (
        // createUserInput?.role !== ROLES.SUPER_ADMIN &&
        // createUserInput?.role !== ROLES.ADMIN &&
        // createUserInput?.role !== ROLES.MANAGER &&
        // createUserInput?.role !== ROLES.USER
        !includes(ROLES, createUserInput?.role)
      ) {
        throw new BadRequestException(`Please check the spelling ${createUserInput.role}`);
      }
      if (role === ROLES.SUPER_ADMIN) {
        return await this.userService.createUser(createUser);
      } else if (role === ROLES.ADMIN) {
        if (newRole !== ROLES.MANAGER && newRole !== ROLES.USER) {
          // console.log(newRole);
          throw new BadRequestException(`You cannot create ${newRole}`);
        }
        return await this.userService.createUser(createUser);
      } else if (role === ROLES.MANAGER) {
        if (newRole !== 'USER') {
          throw new BadRequestException(`You cannot create ${newRole}`);
        }
        return await this.userService.createUser(createUser);
      } else if (role === ROLES.USER) {
        throw new BadRequestException(`You dont have access to create ${newRole}`);
      }
    }
  }

  // findOneUserForSignup -> createUser
  async findOneUserForSignup(
    email?: string,
    username?: string,
    phoneNumber?: string,
  ): Promise<User | null> {
    const user = await this.userService.findOneUserForSignup(email, username, phoneNumber);
    return user;
  }

  // getUserByAccessToken
  async getUserByAccessToken(access_token: string): Promise<User> {
    return await this.verify(access_token);
  }

  async updateUserProfileByAccessToken(
    access_token: string,
    updateUserProfileInput: UpdateUserProfileInput,
  ): Promise<User> {
    const userProfile = await this.verify(access_token);
    const updatedUserProfile = await this.userService.updateUserProfileById(
      userProfile._id,
      updateUserProfileInput,
    );
    return updatedUserProfile;
  }

  // verify token
  async verify(token: string): Promise<User> {
    const decoded = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user = await this.userService.getUserByEmailId(decoded.email);
    return user;
  }

  // createTokens
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

  // storeRefreshToken
  async storeRefreshToken(email: string, refreshToken: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const user = await this.userService.getUserByEmailId(email);
    return await this.userService.updateRefreshTokenFromUser(user.email, hashedRefreshToken);
  }

  // refreshAccessToken
  async refreshAccessToken(refresh_token: string): Promise<string> {
    const payload = this.jwtService.decode(refresh_token);
    const { email } = payload;
    const user = await this.userService.getUserByEmailId(email);
    const refreshToken = await bcrypt.compare(refresh_token, user.hashedRefreshToken);
    // console.log(refreshToken);
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
    // console.log('access_token', access_token, '\n\n');

    const refresh_token = this.jwtService.sign(
      { ...payload, access_token },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION')}d`,
      },
    );
    // console.log('refresh_token', refresh_token);
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

  // validateOtp
  async validateOtp(otp: number): Promise<LoginResponse> {
    const user = await this.userService.validateOtp(otp);
    const tokens = await this.createTokens(user._id, user.email, user.role);
    // // console.log(user.email);

    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;
    const _id = user._id;
    const email = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const role = user.role;
    const createdAt = user.createdAt;
    const updatedAt = user.updatedAt;
    const isEmailVerified = user.isEmailVerified;

    const userResponse: UserResponse = {
      _id,
      email,
      firstName,
      lastName,
      role,
      createdAt,
      updatedAt,
      isEmailVerified,
    };

    return { access_token, refresh_token, userResponse };
  }
}
