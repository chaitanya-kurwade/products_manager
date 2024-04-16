import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserResponse } from './responses/user-response.entity';
import { PaginationInput, Public } from 'common/library';
import { ROLES } from './enums/role.enum';
import { Roles } from 'common/library/decorators/roles.decorator';
import { UsersList } from './responses/user-list.response';
import { CurrentUser } from 'common/library/decorators/current-user.decorator';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Roles(ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPER_ADMIN)
  @Query(() => UsersList, { name: 'getAllUsers' })
  async getAllUsers(
    @CurrentUser('role') role: string,
    @Args('paginationInput', { nullable: true })
    paginationInput: PaginationInput,
    @Args('searchFields', { type: () => [String], nullable: true })
    searchFields?: string[],
  ): Promise<UsersList> {
    const usersList = await this.usersService.getAllUsers(
      paginationInput,
      searchFields ?? [],
      role,
    );
    return usersList;
  }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id') _id: string) {
  //   return this.usersService.findOne(_id);
  // }

  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER)
  @Mutation(() => UserResponse)
  async updateUser(
    @CurrentUser('role') role: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.usersService.updateUser(updateUserInput._id, updateUserInput, role);
    return user;
  }

  // @Mutation(() => User)
  // removeUser(@Args('_id') _id: string) {
  //   return this.usersService.remove(_id);
  // }

  // @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER)
  // @Query(() => UserResponse, { name: 'userByEmail' })
  // async getUserByEmailId(@Args('email') email: string, @CurrentUser('role') role: string) {
  //   const user = await this.usersService.getUserByEmailId(email, role);
  //   return user;
  // }

  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER)
  @Query(() => UserResponse, { name: 'userByEmail' })
  async getUserById(
    @Args('userId') userId: string,
    @CurrentUser('role') role: string,
  ): Promise<User> {
    const user = await this.usersService.getUserById(userId, role);
    return user;
  }

  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER)
  @Mutation(() => String, { name: 'userLogout' })
  async userLogout(@Args('email') email: string): Promise<string> {
    return await this.usersService.userLogout(email);
  }

  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER)
  @Mutation(() => String, { name: 'createPassword' })
  async createPassword(
    @Args('newPassword') newPassword: string,
    @Args('_id') _id: string,
  ): Promise<string> {
    return await this.usersService.createPassword(_id, newPassword);
  }

  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER)
  @Mutation(() => String, { name: 'updatePassword' })
  async updatePassword(
    @Args('_id') _id: string,
    @Args('oldPassword', { nullable: true }) oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<string> {
    return await this.usersService.updatePassword(_id, oldPassword, newPassword);
  }

  @Public()
  @Mutation(() => String, { name: 'forgetPasswordSendEmail' })
  async forgetPasswordSendEmail(@Args('_id') _id: string): Promise<string> {
    return await this.usersService.forgetPasswordSendEmail(_id);
  }

  // @Mutation(() => String, { name: 'receiveForgetPasswordToken' })
  // async receiveForgetPasswordToken(newPassword: string, reset_token: string) {
  //   return await this.usersService.receiveForgetPasswordToken(
  //     newPassword,
  //     reset_token,
  //   );
  // }
}
