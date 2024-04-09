import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './users/inputs/user-login.input';
import { LoginResponse } from './users/responses/user-login.response.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './users/inputs/create-user.input';
import { Public } from 'common/library/decorators/public.decorator';
import { UserResponse } from './users/responses/user-response.entity';
import { User } from './users/entities/user.entity';
import { ContextService } from 'common/library/service/context.service';
import { Request } from 'express';
import { Roles } from 'common/library/decorators/roles.decorator';
import { ROLES } from './users/enums/role.enum';
import { CurrentUser } from 'common/library/decorators/current-user.decorator';
import { CredentialToLoginResponse } from './users/responses/credential-to-login.response.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @Public()
  async login(@Args('userLoginInput') userLoginInput: UserLoginInput): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(
      userLoginInput.userCredential,
      userLoginInput?.passwordOrOtp,
    );
    return loginResponse;
  }

  @Mutation(() => CredentialToLoginResponse)
  @Public()
  async enterCredentialToLogin(
    @Args('credential') credential: string,
  ): Promise<CredentialToLoginResponse> {
    return this.authService.enterCredentialToLogin(credential);
  }

  // @Mutation(() => String)
  // @Public()
  // async enterPasswordToLogin(password: string): Promise<LoginResponse> {
  //   const loginResponse = await this.authService.enterPasswordToLogin(password);
  //   return loginResponse;
  // }

  @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPERADMIN)
  @Mutation(() => UserResponse)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser('role') role: string,
  ): Promise<UserResponse | null> {
    return this.authService.createUser(createUserInput, role);
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

  @Query(() => UserResponse, { name: 'getUserByAccessToken' })
  async getUserByAccessToken(@Context() context: { req: Request }): Promise<User> {
    const access_token = context.req.headers['authorization']?.split(' ')[1] || null;
    const user = await this.authService.getUserByAccessToken(access_token);
    return user;
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'validateOtp' })
  async validateOtp(@Args('otp') otp: number): Promise<LoginResponse> {
    const loginResponse = await this.authService.validateOtp(otp);
    return loginResponse;
  }
}
