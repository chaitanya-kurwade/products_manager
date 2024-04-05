import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './users/inputs/user-login.input';
import { LoginResponse } from './users/responses/user-login.response.entity';
import { BadGatewayException, BadRequestException, NotFoundException } from '@nestjs/common';
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
    const user = await this.authService.findOneUser(
      userLoginInput.email,
      userLoginInput.username,
      userLoginInput.phoneNumber,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user) {
      const loginResponse = await this.authService.login(user.email, userLoginInput.password);
      return loginResponse;
    }
  }

  @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERADMIN)
  @Mutation(() => UserResponse)
  @Public()
  async signup(
    @Context() context: { req: Request },
    @Args('signupUserInput') signupUserInput: CreateUserInput,
  ) {
    console.log({ signupUserInput }, 'signupUserInput');
    // if (!signupUserInput?.email) {
    //   throw new BadGatewayException('The email already exists');
    // }
    const existingUser = await this.authService.findOneUser(
      signupUserInput.email,
      signupUserInput.username,
      signupUserInput.phoneNumber,
    );
    console.log({ existingUser });

    if (
      signupUserInput?.phoneNumber &&
      existingUser &&
      signupUserInput?.phoneNumber === existingUser?.phoneNumber
    ) {
      throw new BadGatewayException('The phone number already exists');
    }
    if (signupUserInput?.email === existingUser?.email) {
      throw new BadGatewayException('The email already exists');
    }
    if (signupUserInput?.username && signupUserInput.username === existingUser?.username) {
      throw new BadGatewayException('The username already exists');
    }
    console.log('here');

    const { role } = await new ContextService().getContextInfo(context.req);
    if (existingUser === null) {
      const newUser = await this.authService.signup(signupUserInput, role);
      return newUser;
    }
  }

  @Mutation(() => String, { name: 'RefreshToken' })
  @Public()
  async refreshAccessToken(@Context() context: { req: Request }) {
    const refreshToken = context.req.headers['authorization']?.split(' ')[1] || null;
    if (!refreshToken) {
      throw new BadRequestException('token not found');
    }
    const access_token = await this.authService.refreshAccessToken(refreshToken);
    return access_token;
  }

  @Query(() => UserResponse, { name: 'getUserByAccessToken' })
  async getUserByAccessToken(@Context() context: { req: Request }): Promise<User> {
    const access_token = context.req.headers['authorization']?.split(' ')[1] || null;
    const user = await this.authService.getUserByAccessToken(access_token);
    return user;
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'validateOtp' })
  async validateOtp(@Args('otp') otp: number) {
    return await this.authService.validateOtp(otp);
  }
}
