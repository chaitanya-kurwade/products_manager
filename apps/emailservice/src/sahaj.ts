/**
 * 
 * 

import Config from "./config.type";
export default (): Config => ({
  gateway: {
    port: parseInt(process.env.PORT, 10) || 2201,
    hierarchy: {
      host: process.env.HIERARCHY_MS_HOST,
    },
  },
  jwtSecret: {
    access_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET,
  },
  database: {
    mongo_url: process.env.MONGO_URL,
  },
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "developerpratikkajare@gmail.com",
    pass: "fqxywbunqwmybwkk",  // from Go to your Google Account settings by visiting https://myaccount.google.com.
                              // Click on "Security" in the left sidebar.
                            // Under "Signing in to Google," click on "2-Step Verification."
                            // SET APP_PASSWORD
    // user: '',
    // pass: '',
  },
  host: {
    url: "<server-url>",
    port: "3000",
  },
});



auth.servics
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from "@nestjs/common";
import { UpdateAuthInput } from "./inputs/update-auth.input";
import { SignUpInput } from "../user/inputs/sign-up.input";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import configuration from "libs/common/config/configuration";
import { SignInInput } from "../user/inputs/sign-in.input";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  EmailVerification,
  EmailVerificationDocument,
} from "./interfaces/email-verification";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectModel(EmailVerification.name)
    private emailVerificationModel: Model<EmailVerificationDocument>
  ) {}
  async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: "10m",
        secret: configuration().jwtSecret.access_secret,
      }
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: "7d",
        secret: configuration().jwtSecret.refresh_secret,
      }
    );
    return { accessToken, refreshToken };
  }
  async signUp(signUpInput: SignUpInput) {
    await this.userService.validateCreateUserRequest(signUpInput);
    const user = await this.userService.createUser(signUpInput);
    const { accessToken, refreshToken } = await this.createTokens(
      user._id,
      user.email
    );
    await this.userService.updateRefreshToken(user._id, refreshToken);
    return { accessToken, refreshToken, user };
  }
  async signIn(signInInput: SignInInput) {
    const user = await this.userService.findUserWithEmail(signInInput.email);
    if (!user) {
      throw new UnauthorizedException("Credentials are not valid.");
    }
    const passwordIsValid = await bcrypt.compare(
      signInInput.password,
      user.password
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException("Credentials are not valid.");
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user._id,
      user.email
    );
    await this.userService.updateRefreshToken(user._id, refreshToken);
    return { accessToken, refreshToken, user };
  }
  //!new
  async createEmailToken(email: any): Promise<boolean> {
    const emailVerification = await this.emailVerificationModel.findOne({
      email,
    });
    console.log(emailVerification, "emailVerification");
    if (
      emailVerification != null &&
      (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 <
        15
    ) {
      console.log(emailVerification, "IfvalaemailVerification");
      throw new Error("LOGIN.EMAIL_SENT_RECENTLY");
    } else {
      const emailVerificationModel =
        await this.emailVerificationModel.findOneAndUpdate(
          { email: email },
          {
            email: email,
            emailToken: (
              Math.floor(Math.random() * 900000) + 100000
            ).toString(), //Generate 7 digits number
            timestamp: new Date(),
          },
          { upsert: true }
        );
      console.log(emailVerificationModel, "token");
      return true;
    }
  }
  //!new
  async sendEmailVerification(email: string): Promise<boolean> {
    const model = await this.emailVerificationModel.findOne({ email: email });
    if (model && model.emailToken) {
      const transporter = nodemailer.createTransport({
        host: configuration().mail.host,
        port: configuration().mail.port,
        secure: configuration().mail.secure, // true for 465, false for other ports
        auth: {
          user: configuration().mail.user,
          pass: configuration().mail.pass,
        },
      });
      const mailOptions = {
        from: '"Company" <' + configuration().mail.user + ">",
        to: email, // list of receivers (separated by ,)
        subject: "Verify Email",
        text: "Verify Email",
        html:
          "Hi! <br><br> Thanks for your registration<br><br>" +
          "<a href=" +
          configuration().host.url +
          ":" +
          configuration().host.port +
          "This is your " +
          model.emailToken +
          ">Click here to activate your account</a>", // html body
      };
      const sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log("Message sent: %s", error);
            return reject(false);
          }
          console.log("Message sent: %s", info.messageId);
          resolve(true);
        });
      });
      return sent;
    } else {
      throw new HttpException(
        "REGISTER.USER_NOT_REGISTERED",
        HttpStatus.FORBIDDEN
      );
    }
  }
  //!new
  async verifyEmail(token: number): Promise<any> {
    const emailVerif = await this.emailVerificationModel.findOne({
      emailToken: token,
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.userService.findUserWithEmail(
        emailVerif.email
      );
      if (userFromDb) {
        userFromDb.valid = true;
        const savedUser = await userFromDb.save();
        await emailVerif.deleteOne();
        // return !!savedUser;
        const { accessToken, refreshToken } = await this.createTokens(
          savedUser._id,
          savedUser.email
        );
        await this.userService.updateRefreshToken(savedUser._id, refreshToken);
        console.log(userFromDb);
        console.log(savedUser, "savedUser");
        return { accessToken, refreshToken, userFromDb };
      }
    } else {
      throw new HttpException(
        "LOGIN.EMAIL_CODE_NOT_VALID",
        HttpStatus.FORBIDDEN
      );
    }
  }
  async getNewTokens(id: string, rfToken: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ForbiddenException("Access Denied");
    }
    const verifyRefreshToken = await bcrypt.compare(rfToken, user.refreshToken);
    if (!verifyRefreshToken) {
      throw new ForbiddenException("Access Denied");
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user._id,
      user.email
    );
    await this.userService.updateRefreshToken(user._id, refreshToken);
    return { accessToken, refreshToken, user };
  }
  findAll() {
    return `This action returns all auth`;
  }
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}




auth.resolver
import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginResponse } from "./entities/login-response.entity";
import { UpdateAuthInput } from "./inputs/update-auth.input";
import { SignUpInput } from "../user/inputs/sign-up.input";
import { Public } from "./decorators/public.decorator";
import { SignInInput } from "../user/inputs/sign-in.input";
import { UseGuards } from "@nestjs/common";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { NewTokenResponse } from "./entities/new-token-response.entity";
import { CurrentUserId } from "./decorators/current-userId.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { UserService } from "../user/user.service";
@Resolver(() => LoginResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  @Public()
  @Mutation(() => LoginResponse)
  signUp(@Args("signUpInput") signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }
  @Public()
  @Mutation(() => LoginResponse)
  signIn(@Args("signInInput") signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }
  //!new
  @Public()
  @Mutation(() => String)
  async register(
    @Args("signInInput") createUserDto: SignInInput
  ): Promise<any> {
    const newUser = await this.userService.createUser(createUserDto);
    console.log(newUser, "newUser");
    const emailtoken = await this.authService.createEmailToken(
      createUserDto.email
    );
    console.log(emailtoken, "emailtoken");
    //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
    const sent = await this.authService.sendEmailVerification(newUser.email);
    if (sent) {
      return new Error("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
    } else {
      return new Error("REGISTRATION.ERROR.MAIL_NOT_SENT");
    }
  }
  //!new
  @Public()
  @Mutation(() => LoginResponse, {
    name: "verifyEmail",
  })
  async verifyEmail(@Args("otp") token: number): Promise<any> {
    return await this.authService.verifyEmail(token);
  }
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokenResponse)
  getNewTokens(
    @CurrentUserId() userId: string,
    @CurrentUser("refreshToken") refreshToken: string
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
  @Query(() => [LoginResponse], { name: "auth" })
  findAll() {
    return this.authService.findAll();
  }
  @Query(() => LoginResponse, { name: "auth" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }
  @Mutation(() => LoginResponse)
  updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }
  @Mutation(() => LoginResponse)
  removeAuth(@Args("id", { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}




 * 
 * 
*/
