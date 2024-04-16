import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './users/inputs/user-login.input';
import { LoginResponse } from './users/responses/user-login.response.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './users/inputs/create-user.input';
import { Public } from 'common/library/decorators/public.decorator';
import { UserResponse } from './users/responses/user-response.entity';
import { User } from './users/entities/user.entity';
import { Request } from 'express';
import { Roles } from 'common/library/decorators/roles.decorator';
import { ROLES } from './users/enums/role.enum';
import { CurrentUser } from 'common/library/decorators/current-user.decorator';
import { LoginCredentialResponse } from './users/responses/login-credential.response.entity';
import { UpdateUserProfileResponse } from './users/responses/update-user-profile.response';
import { UpdateUserProfileInput } from './users/inputs/update-user-profile.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => LoginResponse)
  @Public()
  async login(@Args('userLoginInput') userLoginInput: UserLoginInput): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(
      userLoginInput.userCredential,
      userLoginInput?.passwordOrOtp,
    );
    return loginResponse;
  }

  @Mutation(() => LoginCredentialResponse)
  @Public()
  async enterCredentialToLogin(
    @Args('credential') credential: string,
  ): Promise<LoginCredentialResponse> {
    return this.authService.enterCredentialToLogin(credential);
  }

  @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPER_ADMIN)
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

  @Mutation(() => UpdateUserProfileResponse, { name: 'updateUserProfileByAccessToken' })
  async updateUserProfileByAccessToken(
    @Context() context: { req: Request },
    @Args('updateUserProfileInput') updateUserProfileInput: UpdateUserProfileInput,
  ): Promise<User> {
    const access_token = context.req.headers['authorization']?.split(' ')[1] || null;
    const user = await this.authService.updateUserProfileByAccessToken(
      access_token,
      updateUserProfileInput,
    );
    return user;
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'validateOtp' })
  async validateOtp(@Args('otp') otp: number): Promise<LoginResponse> {
    const loginResponse = await this.authService.validateOtp(otp);
    return loginResponse;
  }
}
