import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }
  
  // @UseGuards(JwtAuthGuard)
  // @Query(() => [User], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id') _id: string) {
  //   return this.usersService.findOne(_id);
  // }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => User)
  // removeUser(@Args('_id') _id: string) {
  //   return this.usersService.remove(_id);
  // }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'userByEmail' })
  getUserByEmailId(@Args('email') email: string) {
    return this.usersService.getUserByEmailId(email);
  }
}
