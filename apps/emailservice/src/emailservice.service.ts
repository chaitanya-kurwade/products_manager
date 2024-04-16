import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendEmail, SendEmailDocument } from './entity/sendemail.entity';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailserviceService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(SendEmail.name)
    private readonly sendEmailModel: Model<SendEmailDocument>,
    private readonly configService: ConfigService,
    @Inject('auth') private userClient: ClientProxy,
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

  async sendEmailToVerifyEmail(user: any): Promise<string> {
    const secretKey = await this.configService.get('VERIFY_EMAIL_SECRET_KEY');
    if (!user) {
      throw new NotFoundException('user not found to verify email');
    }
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const token = await jwt.sign({ userId, emailId }, secretKey, { expiresIn: '1d' });
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedToken = await bcrypt.hash(token, salt);
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/emailservice/token/?token=${token}`;
    const info = {
      from: `${user.firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email, <a href="${link}">click here to verify your email</a>.`,
    };
    await this.transporter.sendMail(info);
    await this.sendEmailModel.create({
      token: hashedToken,
      email: emailId,
      userId: userId,
      isActiveToken: true,
      isVerified: false,
      verifiedAt: new Date(),
      createdAt: new Date(),
    });
    return 'verification link sent on your email';
  }

  async generateUniqueString(): Promise<string> {
    // Generate a random 32-bit integer
    const randomInt = Math.floor(Math.random() * (2 ** 64));
    // Convert the integer to a hexadecimal string
    const hexString = randomInt.toString(32);
    // Pad the string with zeros to ensure it's always 8 characters long
    const paddedHexString = hexString.padStart(8, '0');
    return paddedHexString;
  }

  async sendEmailToVerifyEmailAndCreatePassword(user: any): Promise<string> {
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const uniqueString = await this.generateUniqueString();
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/emailservice/getTokenAndCreatePassword/?token=${uniqueString}`;
    const info = {
      from: `${user.firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email, <a href="${link}">click here to verify your email</a>.`,
    };
    await this.transporter.sendMail(info);
    this.sendEmailModel.create({
      hexString: uniqueString,
      email: emailId,
      userId: userId,
      isActiveToken: true,
      isVerified: false,
      verifiedAt: new Date(),
      createdAt: new Date(),
    });
    return 'verification link sent on your email';
  }

  async verifyEmailAndCreatePassword(uniqueString: string, newPassword: string): Promise<string> {
    const verificationProcess = await this.sendEmailModel.findOne({ hexString: uniqueString });
    const userId = verificationProcess.userId;
    if (verificationProcess.hexString && verificationProcess.isActiveToken && newPassword) {
      await this.userClient.emit('updateEmailVerificationStatus', userId);
      // new password
      await firstValueFrom(this.userClient.send('createPassword', { userId, newPassword }));
      const id = verificationProcess._id;
      await this.sendEmailModel.findByIdAndUpdate(id, {
        isActiveToken: false,
        isVerified: true,
      });
      return 'your email is verified, you can close this tab';
    } else {
      return 'link expired';
    }
  }

  async verifyEmail(token: string): Promise<string> {
    const secretKey = await this.configService.get('VERIFY_EMAIL_SECRET_KEY');
    const user: any = await jwt.verify(token, secretKey);
    const userId = user.userId;
    const verificationEntity = await this.sendEmailModel.findOne({ userId });
    const comparedToken = await bcrypt.compare(token, verificationEntity.token);
    // const comparedCode = await bcrypt.compare(code, verificationEntity.code);
    if (!userId) {
      throw new Error('Invalid or expired token');
    }
    const verificationProcess = await this.findOneUsreId(user.userId);

    if (comparedToken && verificationProcess.isActiveToken) {
      await this.userClient.emit('updateEmailVerificationStatus', userId);
      // if (newPassword) {
      //   await firstValueFrom(this.userClient.send('updatePassword', { userId, newPassword }));
      // }
      const id = verificationProcess._id;
      await this.sendEmailModel.findByIdAndUpdate(id, {
        isActiveToken: false,
        isVerified: true,
      });
      return 'your email is verified, you can close this tab';
    } else {
      return 'link expired';
    }
  }

  async findOneUsreId(userId: string): Promise<SendEmail> {
    return await this.sendEmailModel.findOne({ userId });
  }

  async forgetPasswordSendEmail(user: any): Promise<any> {
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const uniqueString = await this.generateUniqueString();
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/emailservice/getTokenAndCreatePassword/?token=${uniqueString}`;
    const info = {
      from: `${user.firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email, <a href="${link}">click here to verify your email</a>.`,
    };
    await this.transporter.sendMail(info);
    this.sendEmailModel.create({
      hexString: uniqueString,
      email: emailId,
      userId: userId,
      isActiveToken: true,
      isVerified: false,
      verifiedAt: new Date(),
      createdAt: new Date(),
    });
    return 'change password link sent on your email';
  }

  async forgetPassword(token: string, newPassword: string): Promise<string> {
    await this.userClient.emit('forgetPassword', { token, newPassword });
    return 'password changed sucessfully';
  }
}
