import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserLoginInput } from './users/inputs/user-login.input';
import { LoginResponse } from './users/responses/user-login.response.entity';
import {
  BadRequestException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { CreateUserInput } from './users/inputs/create-user.input';
import { Public } from 'common/library/decorators/public.decorator';
import { UserResponse } from './users/responses/user-response.entity';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @Public()
  async login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<{ access_token: string }> {
    const loginResponse = await this.authService.login(
      userLoginInput.email,
      userLoginInput.password,
    );
    if (!userLoginInput.email) {
      throw new NotFoundException('Invalid email in auth resolver');
    }
    if (!loginResponse) {
      throw new Error('Invalid response in auth resolver');
    }
    return loginResponse;
  }

  @Mutation(() => UserResponse)
  @Public()
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = this.authService.signup(createUserInput);
    return user;
  }

  @Mutation(() => String, { name: 'RefreshToken' })
  @Public()
  async refreshAccessToken(@Context() context: { req: Request }) {
    const refreshToken =
      context.req.headers['authorization']?.split(' ')[1] || null;
    if (!refreshToken) {
      throw new BadRequestException('token not found');
    }
    const access_token =
      await this.authService.refreshAccessToken(refreshToken);
    return access_token;
  }
}
