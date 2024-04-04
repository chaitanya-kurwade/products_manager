import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './users/inputs/user-login.input';
import { LoginResponse } from './users/responses/user-login.response.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './users/inputs/create-user.input';
import { Public } from 'common/library/decorators/public.decorator';
import { UserResponse } from './users/responses/user-response.entity';
import { User } from './users/entities/user.entity';
import { ContextService } from 'common/library/service/context.service';
import { Request } from 'express';
import { Roles } from 'common/library/decorators/roles.decorator';
import { ROLES } from './users/enums/role.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @Public()
  async login(@Args('userLoginInput') userLoginInput: UserLoginInput): Promise<LoginResponse> {
    const credential =
      userLoginInput.email || userLoginInput.username || userLoginInput.phoneNumber;
    const userLogin = await this.authService.enterUsernameOrEmailOrPhoneNumberToLogin(
      credential,
      userLoginInput.password,
    );
    return userLogin;
  }

  @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERADMIN)
  @Mutation(() => UserResponse)
  @Public()
  async signup(
    @Context() context: { req: Request },
    @Args('signupUserInput') signupUserInput: CreateUserInput,
  ) {
    const { role } = await new ContextService().getContextInfo(context.req);
    const user = await this.authService.signup(signupUserInput, role);
    return user;
  }

  @Mutation(() => String, { name: 'RefreshToken' })
  @Public()
  async refreshAccessToken(@Context() context: { req: Request }): Promise<string> {
    const refreshToken = context.req.headers['authorization']?.split(' ')[1] || null;
    if (!refreshToken) {
      throw new BadRequestException('token not found');
    }
    const access_token = await this.authService.refreshAccessToken(refreshToken);
    return access_token;
  }

  @Mutation(() => UserResponse, { name: 'getUserByAccessToken' })
  async getUserByAccessToken(@Context() context: { req: Request }): Promise<User> {
    const access_token = context.req.headers['authorization']?.split(' ')[1] || null;

    const user = await this.authService.getUserByAccessToken(access_token);
    return user;
  }

  @Public()
  @Mutation(() => String, { name: 'loginViaOtp' })
  async loginViaOtpAndPhoneOrEmail(@Args('phoneOrEmail') phoneOrEmail: string) {
    return await this.authService.loginViaOtpAndPhoneOrEmail(phoneOrEmail);
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'validateOtp' })
  async validateOtp(@Args('otp') otp: number) {
    return await this.authService.validateOtp(otp);
  }
}
