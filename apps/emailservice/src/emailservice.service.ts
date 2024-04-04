import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { SendEmail, SendEmailDocument } from './entity/sendemail.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailserviceService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(SendEmail.name)
    private readonly sendEmailModel: Model<SendEmailDocument>,
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

  async checkHexIsUnique(hexString: string): Promise<string> {
    const hexInDb = await this.sendEmailModel.findOne({ value: hexString }).exec();
    if (!hexInDb) {
      return hexString;
    } else {
      return 'hexString is not unique';
    }
  }

  async getUserByEmail(email: string) {
    const user = this.sendEmailModel.find({ email }).exec;
    return user;
  }

  async saveHexInDB(email: string, hexString: string) {
    // const user = this.getUserByEmail(email);
    // if (user) {
    //   const hexInDb = await this.sendEmailModel.findOne({
    //     email,
    //     hexString,
    //   });
    //   return hexInDb;
    // }
    const hexInDb = await this.sendEmailModel.create({ email, hexString });
    return hexInDb;
  }

  async sendEmailToClient(email: string, hexString: string) {
    const info = await this.transporter.sendMail({
      from: `${this.configService.get('SENDER_NAME')} ${this.configService.get('SENDER_EMAIL')}>`,
      to: email,
      html: `<p>Hello, ${email}!</p><p>This is a test email and it is your reset_token "${hexString}".</p>`,
    });
    console.log(hexString);
    this.saveHexInDB(email, hexString);
    console.log('Message sent: %s', info.messageId);
    await this.transporter.sendMail(info);
    const timestamp = Date.now();
    return { email, hexString, timestamp };
  }

  // async receiveForgetPasswordToken(newPassword: string, reset_token: string) {
  //   //?     check if token is expired or not
  //   this.sendEmailModel.findOne({ hexString });
  //   const currentTime = new Date();
  //   if (currentTime) {
  //   }
  //   //todo  if not ->
  //   console.log(newPassword, reset_token);
  // }
}
