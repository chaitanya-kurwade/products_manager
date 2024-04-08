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

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @Public()
  async login(@Args('userLoginInput') userLoginInput: UserLoginInput): Promise<LoginResponse> {
    const userWithLoginCredential = await this.authService.findOneUserForLogin(
      userLoginInput.userCredential,
    );
    const user = userWithLoginCredential.user;
    const userCredential = userWithLoginCredential.userCredential;
    const isEmail = await this.authService.validateEmail(userCredential);
    const isPhoneNumber = await this.authService.validatePhoneNumber(userCredential);

    if (!user && isPhoneNumber) {
      throw new NotFoundException(
        'User not found, incorrect phone number: ' + userLoginInput.userCredential,
      );
    }

    if (!user && isEmail) {
      throw new NotFoundException(
        'User not found, incorrect email: ' + userLoginInput.userCredential,
      );
    }

    if (!user && (!isEmail || !isPhoneNumber)) {
      throw new NotFoundException(
        'User not found, incorrect username: ' + userLoginInput.userCredential,
      );
    }

    if (user) {
      const loginResponse = await this.authService.login(
        userLoginInput.userCredential,
        userLoginInput.password,
      );
      return loginResponse;
    }
  }

  @Mutation(() => String)
  @Public()
  async enterCredentialToLogin(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<string> {
    const userWithLoginCredential = await this.authService.findOneUserForLogin(
      userLoginInput.userCredential,
    );
    const user = userWithLoginCredential.user;
    const userCredential = userWithLoginCredential.userCredential;
    const isEmail = await this.authService.validateEmail(userCredential);
    const isPhoneNumber = await this.authService.validatePhoneNumber(userCredential);

    if (!user && isPhoneNumber) {
      throw new NotFoundException(
        'User not found, incorrect phone number: ' + userLoginInput.userCredential,
      );
    }

    if (!user && isEmail) {
      throw new NotFoundException(
        'User not found, incorrect email: ' + userLoginInput.userCredential,
      );
    }

    if (!user && (!isEmail || !isPhoneNumber)) {
      throw new NotFoundException(
        'User not found, incorrect username: ' + userLoginInput.userCredential,
      );
    }

    if (!isPhoneNumber) {
      const credentialResponse = await this.authService.enterCredentialToLogin(
        userLoginInput.userCredential,
      );
      return credentialResponse;
    }
    if (isPhoneNumber) {
      return 'otp sent'
    }
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
    @Context() context: { req: Request },
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserResponse | null> {
    // if (!signupUserInput?.email) {
    //   throw new BadGatewayException('The email already exists');
    // }
    const existingUser = await this.authService.findOneUserForSignup(
      createUserInput.username,
      createUserInput.email,
      createUserInput.phoneNumber,
    );

    if (
      createUserInput?.phoneNumber &&
      existingUser &&
      createUserInput?.phoneNumber === existingUser?.phoneNumber
    ) {
      throw new BadRequestException('The phone number already exists');
    }
    if (createUserInput?.email === existingUser?.email) {
      throw new BadRequestException('The email already exists');
    }
    if (createUserInput?.username && createUserInput.username === existingUser?.username) {
      throw new BadRequestException('The username already exists');
    }

    const { role } = await new ContextService().getContextInfo(context.req);
    if (existingUser === null) {
      const newUser = await this.authService.createUser(createUserInput, role);
      return newUser;
    }
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
