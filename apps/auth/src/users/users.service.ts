import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
// import * as crypto from 'crypto';
import { PaginationInput } from 'common/library';
import * as nodemailer from 'nodemailer';
import { UserResponse } from './responses/user-response.entity';
import { CreateUserViaGoogleInput } from './inputs/create-user-via-google.input';
import { EmailserviceService } from 'apps/emailservice/src/emailservice.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailserviceService,
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
    if (!createUserInput.email) {
      throw new BadRequestException('user not created');
    }
    const { email, username, phoneNumber } = createUserInput;
    const user = await this.userModel.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }, { username: username }],
    });
    if (user) {
      throw new BadRequestException('user not created, please pass valid username or phone number');
    }
    const password = await bcrypt.hash(createUserInput.password, 10);
    return this.userModel.create({
      ...createUserInput,
      password,
    });
  }

  async getAllUsers(paginationInput: PaginationInput, searchFields?: string[]) {
    const { page, limit, search, sortField, sortOrder } = paginationInput;
    let query = this.userModel.find();
    if (searchFields == null || !searchFields.length) {
      console.log(query);
      if (search) {
        query = query.where('email').regex(new RegExp(search, 'i'));
      }
      if (!page && !limit && !sortField && !sortOrder) {
        return query.sort({ createdAt: -1 }).exec();
      }
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        throw new BadRequestException('Invalid sortOrder. It must be either ASC or DESC.');
      }
      if (sortField && sortOrder) {
        console.log(sortOrder, 'single', sortField);
        const sortOptions: { [key: string]: SortOrder } = {};
        sortOptions[sortField] = sortOrder.toLowerCase() as SortOrder;
        query = query.sort(sortOptions);
      }
      const skip = (page - 1) * limit;
      const users = await query.skip(skip).limit(limit).exec();
      if (!users && users.length === 0) {
        throw new NotFoundException('Users not found');
      }
      return users;
    } else {
      query = this.buildQuery(search, searchFields);
      console.log(query);
      if (!page && !limit) {
        return query.sort({ createdAt: -1 }).exec();
      }
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        throw new BadRequestException('Invalid sortOrder. It must be either ASC or DESC.');
      }
      if (sortField && sortOrder) {
        console.log(sortOrder, 'single', sortField);
        const sortOptions: { [key: string]: SortOrder } = {};
        sortOptions[sortField] = sortOrder.toLowerCase() as SortOrder;
        query = query.sort(sortOptions);
      }
      const skip = (page - 1) * limit;
      const users = await query.skip(skip).limit(limit).exec();
      if (!users && users.length == 0) {
        throw new NotFoundException('Users not found');
      }
      return users;
    }
  }

  private buildQuery(search: string, searchFields?: string[]): any {
    let query = this.userModel.find();
    if (search) {
      const orConditions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search, 'i') },
      }));
      query = query.or(orConditions);
    }
    return query;
  }

  async findOne(id: string): Promise<User> {
    const getOneUser = await this.userModel.findById(id);
    if (!getOneUser) {
      throw new NotFoundException(`user not found  with id: ${id}`);
    }
    return getOneUser;
  }

  async update(_id: string, updateUserInput: UpdateUserInput): Promise<User> {
    if (!updateUserInput.email) {
      throw new NotFoundException(`user not updated  with id: ${_id}`);
    }
    return this.userModel.findByIdAndUpdate({
      updateUserInput,
    });
  }

  async remove(_id: string): Promise<any> {
    const user = await this.userModel.findByIdAndDelete(_id);
    if (!user) {
      throw new BadRequestException('User not deleted');
    }
    return user;
  }

  async getUserByEmailId(email: string): Promise<User> {
    const userByEmailId = await this.userModel.findOne({ email: email });
    if (!userByEmailId) {
      throw new NotFoundException('User not found of this email: ' + email);
    }
    return userByEmailId;
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
    await user.save();
    const logOutResponse = `you've been logged out successfully with ${email}`;
    return logOutResponse;
  }

  async enterUsernameOrEmailOrPhoneNumberToLogin(credential: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [{ email: credential }, { phoneNumber: credential }, { username: credential }],
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
      // console.log('Message sent: %s', info.messageId);
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

  async getUserByPhoneOrEmailOrUsername(phoneOrEmailOrUsername: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
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

  async updateEmailVerificationStatus(userId: string) {
    return await this.userModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
    });
  }
}
