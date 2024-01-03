import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = await this.userModel.create(createUserInput);
    if (user) {
      throw new BadRequestException('user not created');
    }
    return user;
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    if (!users && users.length == 0) {
      throw new NotFoundException('users not found');
    }
    return users;
  }

  findOne(id: string) {
    const getOneUser = this.userModel.findById(id);
    if (!getOneUser) {
      throw new NotFoundException(`user not found  with id: ${id}`);
    }
    return getOneUser;
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    const user = this.userModel.findByIdAndUpdate(id, updateUserInput);
    if (!user) {
      throw new NotFoundException(`user not updated  with id: ${id}`);
    }
    return user;
  }

  remove(_id: string) {
    const user = this.userModel.findByIdAndDelete(_id);
    if (!user) {
      throw new BadRequestException('User not deleted');
    }
    return user;
  }

  getUserByEmailId(email: string) {
    const userByEmailId = this.userModel.findOne({ email: email }).exec();
    if (!userByEmailId) {
      throw new NotFoundException('User not found of this email: ' + email);
    }
    return userByEmailId;
  }
}
