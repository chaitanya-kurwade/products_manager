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
import { PASSWORD_ACTION_TYPE } from './enums/password-action-type.enum';

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

  async generateUniqueString(): Promise<string> {
    // Generate a random 32-bit integer
    const randomInt = Math.floor(Math.random() * (2 ** 64));
    // Convert the integer to a hexadecimal string
    const hexString = randomInt.toString(32);
    // Pad the string with zeros to ensure it's always 8 characters long
    const paddedHexString = hexString.padStart(8, '0');
    return paddedHexString;
  }

  async findOneUsreId(userId: string): Promise<SendEmail> {
    return await this.sendEmailModel.findOne({ userId });
  }

  async sendEmailToVerifyEmailAndCreatePassword(user: any): Promise<string> {
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const uniqueString = await this.generateUniqueString();
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/${uniqueString}`;
    const info = {
      from: `${firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email, create password',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email, <a href="${link}">click here to create a new password</a>.`,
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
    return 'verification link sent on your email, and create password';
  }

  async verifyEmailAndCreatePassword(uniqueString: string, newPassword: string): Promise<string> {
    const verificationProcess = await this.sendEmailModel.findOne({ hexString: uniqueString });
    const userId = verificationProcess.userId;
    if (verificationProcess.hexString && verificationProcess.isActiveToken && newPassword) {
      // new password
      await firstValueFrom(this.userClient.send('createPassword', { userId, newPassword }));
      const _id = verificationProcess._id;
      await this.sendEmailModel.findByIdAndUpdate(_id, {
        isActiveToken: false,
        isVerified: true,
        passwordActionType: PASSWORD_ACTION_TYPE.CREATE_PASSWORD
      });
      return 'your email is verified and created pass, you can close this tab';
    } else {
      return 'link expired';
    }
  }

  async sendEmailToVerifyEmail(user: any): Promise<string> {
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const uniqueString = await this.generateUniqueString();
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/${uniqueString}`;
    const info = {
      from: `${firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email, <a href="${link}">click here to verify your email</a>.`,
    };
    await this.transporter.sendMail(info);
    await this.sendEmailModel.create({
      token: uniqueString,
      email: emailId,
      userId: userId,
      isActiveToken: true,
      isVerified: false,
      verifiedAt: new Date(),
      createdAt: new Date(),
    });
    return 'verification link sent on your email';
  }

  async verifyEmail(uniqueString: string): Promise<string> {
    const verificationProcess = await this.sendEmailModel.findOne({ hexString: uniqueString });
    const userId = verificationProcess.userId;
    if (verificationProcess.hexString && verificationProcess.isActiveToken) {
      await this.userClient.emit('updateEmailVerificationStatus', userId);
      // new password
      const _id = verificationProcess._id;
      await this.sendEmailModel.findByIdAndUpdate(_id, {
        isActiveToken: false,
        isVerified: true,
      });
      return 'your email is verified, you can close this tab';
    } else {
      return 'link expired';
    }
  }

  async forgetPasswordSendEmail(user: any): Promise<any> {
    const { _id: userId, email: emailId, firstName: firstName } = user;
    const uniqueString = await this.generateUniqueString();
    const link = `${this.configService.get(
      'VERIFY_EMAIL_LINK',
    )}/${uniqueString}`;
    const info = {
      from: `${user.firstName} <${this.configService.get('SENDER_EMAIL')}>`,
      to: emailId,
      subject: 'verify your email, forget password',
      html: `<b>Hello, ${firstName}!</b><p>This is an email to verify your email and , <a href="${link}">click here to change your forget password</a>.`,
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

  async forgetPassword(uniqueString: string, newPassword: string): Promise<string> {
    const verificationProcess = await this.sendEmailModel.findOne({ hexString: uniqueString });
    const email = verificationProcess.email;
    await this.userClient.emit('forgetPassword', { email, newPassword });
    const _id = verificationProcess._id;
    await this.sendEmailModel.findByIdAndUpdate(_id, {
      isActiveToken: false,
      isVerified: true,
      passwordActionType: PASSWORD_ACTION_TYPE.FORGET_PASSWORD
    });
    return 'password changed sucessfully';
  }
}
