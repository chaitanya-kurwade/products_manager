import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
// import * as crypto from 'crypto';
import { PaginationInput } from 'common/library';
import * as nodemailer from 'nodemailer';
import { UserResponse } from './responses/user-response.entity';
import { CreateUserViaGoogleInput } from './inputs/create-user-via-google.input';
import { ConfigService } from '@nestjs/config';
import { ROLES } from '../../../../libs/library/src/enums/role.enum';
import { UpdateUserProfileInput } from './inputs/update-user-profile.input';
import { ClientProxy } from '@nestjs/microservices';
import { UsersList } from './responses/user-list.response';
import { CreateCustomerInput } from './inputs/create-customer.input';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    @Inject('emailservice') private emailClient: ClientProxy,
  ) {
    this.transporter = nodemailer.createTransport({
      host: `${this.configService.get('SMTP_HOST')}`,
      port: `${this.configService.get('SMTP_PORT')}`,
      secure: false,
      auth: {
        user: `${this.configService.get('SENDER_EMAIL')}`,
        pass: `${this.configService.get('SENDER_SMTP_PASS')}`,
      },
    });
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    if (!createUserInput?.email) {
      throw new BadRequestException('User not created');
    }
    const email = createUserInput.email;
    const username = createUserInput.username;
    const phoneNumber = createUserInput.phoneNumber;

    const user = await this.userModel.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }, { username: username }],
    });

    if (user) {
      throw new BadRequestException('user not created, please pass valid username or phone number');
    }
    // const password = await bcrypt.hash(createUserInput.password, 10); // 10 = salt
    const newUser = await this.userModel.create(createUserInput);
    return newUser;
  }

  // customerSignup
  async customerSignup(createCustomerInput: CreateCustomerInput): Promise<UserResponse> {
    if (!createCustomerInput.email) {
      throw new BadRequestException('User not created');
    }
    const email = createCustomerInput.email;
    console.log({ email });
    const existingCustomer = await this.userModel.findOne({ email: email }).exec();
    if (existingCustomer) {
      throw new BadRequestException('user not created, please pass valid username or phone number');
    }
    if (existingCustomer.email) {
      throw new BadRequestException(`user already exists with email: ${existingCustomer.email}`);
    }
    if (existingCustomer.phoneNumber) {
      throw new BadRequestException(`user already exists with phone number: ${existingCustomer.phoneNumber}`);
    }
    if (existingCustomer.username) {
      throw new BadRequestException(`user already exists with username: ${existingCustomer.username}`);
    }

    const hashedPassword = await bcrypt.hash(createCustomerInput.password, 10); // 10 salt
    const newUser = await this.userModel.create({ ...createCustomerInput, password: hashedPassword, isEmailVerified: false, hashedRefreshToken: '', role: ROLES.USER });
    const newEmail = newUser.email;
    const userId = newUser._id;
    const user = { userId, newEmail }
    console.log(user, 'customerSignup');
    this.emailClient.emit('sendEmailToVerifyEmail', user);
    return newUser;
  }

  async getAllUsers(paginationInput?: PaginationInput, searchFields?: string[], role?: string): Promise<UsersList> {
    const { page, limit, search, sortOrder } = paginationInput;
    let query = this.userModel.find();
    let totalCountQuery = this.userModel.find();

    if (role) {
      if (role.toUpperCase() === 'SUPER_ADMIN') {
        // If role is SUPER_ADMIN, return all users
        // No need to modify the query
      } else if (role.toUpperCase() === 'ADMIN') {
        // console.log(role);
        // If role is ADMIN, include MANAGER and USER roles
        query = query.find({ role: { $in: ['MANAGER', 'USER'] } });
        totalCountQuery = totalCountQuery.find({
          role: { $in: ['MANAGER', 'USER'] },
        });
      } else if (role.toUpperCase() === 'MANAGER') {
        // console.log(role);
        // If role is ADMIN, include MANAGER and USER roles
        query = query.find({ role: { $in: ['USER'] } });
        totalCountQuery = totalCountQuery.find({
          role: { $in: ['USER'] },
        });
      } else {
        // For other roles, filter users based on the provided role
        query = query.find({ role: role.toUpperCase() });
        totalCountQuery = totalCountQuery.find({ role: role.toUpperCase() });
      }
    }

    if (search && searchFields.length > 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    let sortOptions = {};
    if (sortOrder) {
      if (sortOrder.toUpperCase() === 'ASC') {
        sortOptions = { createdAt: 1 };
      } else if (sortOrder.toUpperCase() === 'DESC') {
        sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    query = query.sort(sortOptions);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const users = await query.exec();
    const totalCount = await totalCountQuery.countDocuments();

    return { users, totalCount };
  }

  // async getUserById(_id: string) {
  //   const getOneUser = await this.userModel.findById(_id);
  //   if (!getOneUser) {
  //     throw new NotFoundException(`user not found  with id: ${_id}`);
  //   }
  //   return getOneUser;
  // }

  async getUserById(_id: string, role?: string): Promise<User> {
    if (role && role.toUpperCase() === 'SUPER_ADMIN') {
      // If role is SUPER_ADMIN, return any user
      return await this.userModel.findById(_id);
    } else if (role && role.toUpperCase() === 'ADMIN') {
      // If role is ADMIN, only return manager and user
      const user = await this.userModel.findById(_id);
      if (user && (user.role === 'MANAGER' || user.role === 'USER')) {
        return user;
      } else {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
    } else if (role && role.toUpperCase() === 'MANAGER') {
      // If role is ADMIN, only return manager and user
      const user = await this.userModel.findById(_id);
      if (user && user.role === 'USER') {
        return user;
      } else {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
    } else {
      // For other roles, return the user without any restriction
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
      return user;
    }
  }

  async updateUser(_id: string, updateUserInput: UpdateUserInput, role?: string): Promise<User> {
    // const updateInputDemo = new UpdateUserInput();
    const user = await this.getUserById(_id);

    if (!user) {
      throw new NotFoundException(`user not updated  with id: ${_id}`);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(_id, updateUserInput, { new: true });
    // console.log({ updateUserInput }, { role });

    if (role === ROLES.SUPER_ADMIN) {
      return updatedUser;
    } else if (role === ROLES.ADMIN) {
      // try {
      //   if (updateUserInput.role) {
      //     throw new BadRequestException(
      //       `You cannot change ${user.role} to ${updateUserInput.role}`,
      //     );
      //   }
      // } catch (error) {
      //   // console.log(error);
      //   updateInputDemo._id = updatedUser._id;
      //   updateInputDemo.firstName = '';
      //   updateInputDemo.lastName = '';
      //   updateInputDemo.role = '';
      //   return updateInputDemo;
      // }
      if (updateUserInput.role) {
        throw new BadRequestException(`You cannot change ${user.role} to ${updateUserInput.role}`);
      } else if (user.role === ROLES.USER || user.role === ROLES.MANAGER) {
        return updatedUser;
      }
    } else if (role === ROLES.MANAGER) {
      if (updateUserInput.role) {
        throw new BadRequestException(`You cannot change ${user.role} to ${updateUserInput.role}`);
      } else if (user.role === ROLES.USER) {
        return updatedUser;
      }
    }
  }

  async remove(_id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(_id);
    if (!user) {
      throw new BadRequestException('User not deleted');
    }
    return user;
  }

  async getByUsernameOrPhoneOrEmail(credential: string): Promise<User> {
    return await this.userModel.findOne({
      $or: [{ email: credential }, { phoneNumber: credential }, { username: credential }],
    });
  }

  async getUserByEmailId(email: string, role?: string): Promise<User> {
    const userQuery = this.userModel.findOne({ email: email });

    if (role) {
      const user = await userQuery.exec();
      if (!user) {
        throw new NotFoundException(`User not found with email: ${email}`);
      }
      if (role.toUpperCase() === ROLES.SUPER_ADMIN) {
        return user;
      }
      if (role.toUpperCase() === ROLES.ADMIN) {
        if (user.role === 'MANAGER' || user.role === 'USER') {
          return user;
        } else {
          throw new NotFoundException(`User not found with email: ${email}`);
        }
      }
      if (role.toUpperCase() === ROLES.MANAGER) {
        if (user.role === 'USER') {
          return user;
        } else {
          throw new NotFoundException(`User not found with email: ${email}`);
        }
      }
    }
    const user = await userQuery.exec();
    if (!user) {
      throw new NotFoundException(`User not found with email: ${email}`);
    }
    return user;
  }

  async getUserToSignUp(email: string): Promise<User> {
    const userByEmailId = await this.userModel.findOne({ email: email });
    return userByEmailId;
  }

  async updateRefreshTokenFromUser(email: string, hashedRefreshToken: string): Promise<string> {
    const user = await this.getUserByEmailId(email);
    if (user) {
      return this.userModel.findOneAndUpdate({ email }, { hashedRefreshToken }, { new: true });
    }
  }

  async userLogout(email: string): Promise<string> {
    const user = await this.getUserByEmailId(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.hashedRefreshToken = null;
    await this.userModel.findByIdAndUpdate(user._id, { hashedRefreshToken: null }, { new: true });
    const logOutResponse = `you've been logged out successfully with ${email}`;
    return logOutResponse;
  }

  async enterUserIdOrUsernameOrEmailOrPhoneNumberToLogin(credential: string): Promise<User> {
    // console.log({ credential });

    const user = await this.userModel.findOne({
      $or: [
        // { _id: credential },
        { email: credential },
        { phoneNumber: credential },
        { username: credential },
      ],
    });
    if (!user) {
      throw new NotFoundException('user not found, please pass valid credentials');
    }
    return user;
  }

  async sendOtpToLogin(phoneNumberOrEmailOrUsername: string): Promise<string> {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    const userByEmailOrUsername = await this.userModel
      .findOne({
        $or: [{ email: phoneNumberOrEmailOrUsername }, { username: phoneNumberOrEmailOrUsername }],
      })
      .exec();

    // send email
    if (userByEmailOrUsername) {
      //
      const email = userByEmailOrUsername.email;
      const timeInMiliSeconds = this.configService.get('OTP_TIME_IN_MINUTES') * 60000;
      const emailOtpExpiry = Date.now() + timeInMiliSeconds;
      //
      const info = await this.transporter.sendMail({
        from: `<${this.configService.get('SENDER_NAME')} ${this.configService.get(
          'SENDER_EMAIL',
        )}>`,
        to: email,
        subject: 'Otp to login',
        html: `<b>Hello, ${email}!</b><p>This is a email to login via otp, and here is your otp: "${otp}" and it is valid for ${this.configService.get(
          'OTP_TIME_IN_MINUTES',
        )} minutes.</p>`,
      });
      // // console.log('Message sent: %s', info.messageId);
      await this.transporter.sendMail(info);
      await this.userModel.findOneAndUpdate(
        {
          email: email,
        },
        {
          emailOtp: otp,
          emailOtpExpiryTime: emailOtpExpiry,
        },
        { new: true },
      );

      // below logic will convert this.example@gmail.com to thiXXXXXmple@gmail.com
      const [username, domain] = email.split('@');
      const visibleCharsUsername = Math.min(username.length, 5);
      const maskedPartUsername = 'X'.repeat(username.length - visibleCharsUsername);
      const visibleCharsDomain = Math.min(domain.length);
      const maskedPartDomain = 'X'.repeat(domain.length - visibleCharsDomain);

      //
      return `otp sent on email: ${username.substring(
        0,
        visibleCharsUsername,
      )}${maskedPartUsername}@${maskedPartDomain}${domain.substring(
        domain.length - visibleCharsDomain,
      )} sucessfully`;
    }
  }

  async createUserViaGoogle(
    createUserViaGoogleInput: CreateUserViaGoogleInput,
  ): Promise<UserResponse> {
    if (!createUserViaGoogleInput) {
      throw new BadRequestException('user not created');
    }
    const userExists = await this.userModel.findOne({
      email: createUserViaGoogleInput.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userModel.create(createUserViaGoogleInput);
    return user;
  }

  async findOneUserForLogin(userCredential: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
        { email: userCredential },
        { phoneNumber: userCredential },
        { username: userCredential },
      ],
    });
    return user;
  }

  async validateEmail(email: string): Promise<boolean> {
    // Regex for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    // Regex for phone number
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  }

  async findOneUserForSignup(
    email?: string,
    username?: string,
    phoneNumber?: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({
      // ...(email && { email }),
      // ...(username && { username }),
      // ...(phoneNumber && { phoneNumber }),
      $or: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : []),
        ...(username ? [{ username }] : []),
      ],
    });
    return user;
  }

  async getUserByPhoneOrEmailOrUsername(phoneOrEmailOrUsername: string): Promise<User> {
    const user = await this.userModel.findOne({
      $and: [
        { phoneNumber: phoneOrEmailOrUsername },
        { email: phoneOrEmailOrUsername },
        { username: phoneOrEmailOrUsername },
      ],
    });
    return user;
  }

  async validateOtp(otp: number): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ emailOtp: otp }, { phoneOtp: otp }],
      emailOtpExpiryTime: { $gt: Date.now() },
    });
    if (!user) {
      throw new NotFoundException('user not found or otp expired');
    }
    return user;
  }

  async updateEmailVerificationStatus(userId: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
    });
  }

  async updateUserProfileById(
    _id: string,
    updateUserProfileInput: UpdateUserProfileInput,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, updateUserProfileInput, { new: true });
  }

  async createPassword(email: string, newPassword: string): Promise<User | string> {
    const user = await this.enterUserIdOrUsernameOrEmailOrPhoneNumberToLogin(email);
    if (user) {
      const password = await bcrypt.hash(newPassword, 10); // 10 = salt
      const _id = user._id;
      return await this.userModel.findByIdAndUpdate(_id, { password: password, isEmailVerified: true }, { new: true });
    }
  }

  async updatePassword(email: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.enterUserIdOrUsernameOrEmailOrPhoneNumberToLogin(email);
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (isValidPassword) {
      const latestPassword = await bcrypt.hash(newPassword, 10); // 10 = salt
      await this.userModel.findByIdAndUpdate(user._id, { password: latestPassword }, { new: true });
      return 'password updated sucessfully.'
    } else {
      throw new BadRequestException('old password not matched');
    }
  }

  async forgetPasswordSendEmail(email: string): Promise<string> {
    const user = await this.enterUserIdOrUsernameOrEmailOrPhoneNumberToLogin(email);
    if (user) {
      this.emailClient.emit('forgetPasswordSendEmail', user);
    } else {
      throw new NotFoundException('user not found, please pass valid credentials, else');
    }
    return `forget password link sent on ${user.email}`;
  }

  async forgetPassword(email: string, newPassword: string): Promise<User | string> {
    const user = await this.enterUserIdOrUsernameOrEmailOrPhoneNumberToLogin(email);
    if (user.email) {
      const password = await bcrypt.hash(newPassword, 10);
      const _id = user._id;
      return await this.userModel.findByIdAndUpdate(_id, { password: password, isEmailVerified: true }, { new: true });
    } else {
      throw new BadRequestException('password could not changed');
    }
  }
}
