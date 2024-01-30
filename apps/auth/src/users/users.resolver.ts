import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './inputs/update-user.input';
import { UserResponse } from './responses/user-response.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [UserResponse], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id') _id: string) {
  //   return this.usersService.findOne(_id);
  // }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => User)
  // removeUser(@Args('_id') _id: string) {
  //   return this.usersService.remove(_id);
  // }

  // @UseGuards(JwtAuthGuard)
  @Query(() => UserResponse, { name: 'userByEmail' })
  getUserByEmailId(@Args('email') email: string) {
    return this.usersService.getUserByEmailId(email);
  }
}
