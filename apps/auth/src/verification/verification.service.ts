import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification, VerificationDocument } from './entities/verification.entity';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VerificationService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<VerificationDocument>,
    private readonly configService: ConfigService,
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
  // create(createVerificationInput: CreateVerificationInput) {
  //   return this.verificationModel.create(createVerificationInput);
  // }

  // findAll() {
  //   return `This action returns all verification`;
  // }

  // async findOne(_id: string) {
  //   return await this.verificationModel.findById(_id);
  // }

  // update(_id: string, updateVerificationInput: UpdateVerificationInput) {
  //   return this.verificationModel.findByIdAndUpdate(
  //     _id,
  //     updateVerificationInput,
  //   );
  // }

  // remove(_id: string) {
  //   return `This action removes a #${_id} verification`;
  // }

  // async sendEmailToVerifyEmailAndCreatePassword(email: string): Promise<string> {
  //   const secretKey = await this.configService.get('VERIFY_EMAIL_SECRET_KEY');
  //   const user = await this.usersService.getByUsernameOrPhoneOrEmail(email);
  //   if (!user) {
  //     throw new NotFoundException('user not found to verify email');
  //   }
  //   const { _id: userId, email: emailId } = user;
  //   const token = await jwt.sign({ userId, emailId }, secretKey, { expiresIn: '1d' });
  //   const saltRounds = 10;
  //   const salt = await bcrypt.genSalt(saltRounds);
  //   const hashedToken = await bcrypt.hash(token, salt);
  //   const link = `${this.configService.get('VERIFY_EMAIL_LINK')}/auth/token/?token=${token}`;
  //   const info = {
  //     from: `${this.configService.get('SENDER_NAME')} <${this.configService.get('SENDER_EMAIL')}>`,
  //     to: emailId,
  //     subject: 'verify your email',
  //     html: `<b>Hello, ${this.configService.get('SENDER_NAME')}!</b><p>This is an email to verify your email, <a href="${link}">click here to verify your email</a>.`,
  //   };
  //   await this.transporter.sendMail(info);
  //   await this.verificationModel.create({
  //     token: hashedToken,
  //     userId: userId,
  //     isActiveToken: true,
  //     isVerified: false,
  //     verifiedAt: new Date(),
  //     createdAt: new Date(),
  //   });
  //   return 'verification link sent on your email';
  // }

  // async verifyEmail(token: string, newPassword?: string): Promise<string> {
  //   const secretKey = await this.configService.get('VERIFY_EMAIL_SECRET_KEY');
  //   const user: any = await jwt.verify(token, secretKey);
  //   const userId = user.userId;
  //   const verificationEntity = await this.verificationModel.findOne({ userId });
  //   const comparedToken = await bcrypt.compare(token, verificationEntity.token);
  //   if (!userId) {
  //     throw new Error('Invalid or expired token');
  //   }
  //   const verificationProcess = await this.findOneUsreId(user.userId);

  //   if (comparedToken && verificationProcess.isActiveToken) {
  //     await this.usersService.updateEmailVerificationStatus(userId);
  //     if (newPassword) {
  //       await this.usersService.updatePassword(userId, newPassword);
  //     }
  //     const id = verificationProcess._id;
  //     await this.verificationModel.findByIdAndUpdate(id, {
  //       isActiveToken: false,
  //       isVerified: true,
  //     });
  //     return 'your email is verified, you can close this tab';
  //   } else {
  //     return 'link expired';
  //   }
  // }

  // async findOneUsreId(userId: string): Promise<Verification> {
  //   return await this.verificationModel.findOne({ userId });
  // }
}
