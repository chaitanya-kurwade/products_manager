import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationInput } from 'common/library';
import { EmailserviceService } from 'apps/emailservice/src/emailservice.service';
import crypto from 'crypto';
import { SendEmail } from './entities/send-email.entity';
import { ROLES } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailserviceService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    if (!createUserInput.email) {
      throw new BadRequestException('user not created');
    }
    const password = await bcrypt.hash(createUserInput.password, 10);
    return await this.userModel.create({
      ...createUserInput,
      password,
    });
  }

  async getAllUsers(
    paginationInput?: PaginationInput,
    searchFields?: string[],
    role?: string,
  ) {
    const { page, limit, search, sortOrder } = paginationInput;
    let query = this.userModel.find();
    let totalCountQuery = this.userModel.find();

    if (role) {
      if (role.toUpperCase() === 'SUPER_ADMIN') {
        // If role is SUPER_ADMIN, return all users
        // No need to modify the query
      } else if (role.toUpperCase() === 'ADMIN') {
        console.log(role);
        // If role is ADMIN, include MANAGER and USER roles
        query = query.find({ role: { $in: ['MANAGER', 'USER'] } });
        totalCountQuery = totalCountQuery.find({
          role: { $in: ['MANAGER', 'USER'] },
        });
      } else if (role.toUpperCase() === 'MANAGER') {
        console.log(role);
        // If role is ADMIN, include MANAGER and USER roles
        query = query.find({ role: { $in: ['USER'] } });
        totalCountQuery = totalCountQuery.find({
          role: { $in: ['USER'] },
        });
      } else {
        // For other roles, filter users based on the provided role
        query = query.find({ role: role.toUpperCase() });
        totalCountQuery = totalCountQuery.find({ role: role.toUpperCase() });
      }
    }

    if (search && searchFields.length > 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    let sortOptions = {};
    if (sortOrder) {
      if (sortOrder.toUpperCase() === 'ASC') {
        sortOptions = { createdAt: 1 };
      } else if (sortOrder.toUpperCase() === 'DESC') {
        sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    query = query.sort(sortOptions);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const users = await query.exec();
    const totalCount = await totalCountQuery.countDocuments();

    return { users, totalCount };
  }

  // async getUserById(_id: string) {
  //   const getOneUser = await this.userModel.findById(_id);
  //   if (!getOneUser) {
  //     throw new NotFoundException(`user not found  with id: ${_id}`);
  //   }
  //   return getOneUser;
  // }

  async getUserById(_id: string, role?: string) {
    if (role && role.toUpperCase() === 'SUPER_ADMIN') {
      // If role is SUPER_ADMIN, return any user
      return await this.userModel.findById(_id);
    } else if (role && role.toUpperCase() === 'ADMIN') {
      // If role is ADMIN, only return manager and user
      const user = await this.userModel.findById(_id);
      if (user && (user.role === 'MANAGER' || user.role === 'USER')) {
        return user;
      } else {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
    } else if (role && role.toUpperCase() === 'MANAGER') {
      // If role is ADMIN, only return manager and user
      const user = await this.userModel.findById(_id);
      if (user && user.role === 'USER') {
        return user;
      } else {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
    } else {
      // For other roles, return the user without any restriction
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new NotFoundException(`User not found with id: ${_id}`);
      }
      return user;
    }
  }

  async updateUser(
    _id: string,
    updateUserInput: UpdateUserInput,
    role?: string,
  ) {
    // const updateInputDemo = new UpdateUserInput();
    const user = await this.findOne(_id);

    if (!user) {
      throw new NotFoundException(`user not updated  with id: ${_id}`);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      _id,
      updateUserInput,
      { new: true },
    );
    console.log({ updateUserInput }, { role });

    if (role === ROLES.SUPERADMIN) {
      return updatedUser;
    } else if (role === ROLES.ADMIN) {
      // try {
      //   if (updateUserInput.role) {
      //     throw new BadRequestException(
      //       `You cannot change ${user.role} to ${updateUserInput.role}`,
      //     );
      //   }
      // } catch (error) {
      //   console.log(error);
      //   updateInputDemo._id = updatedUser._id;
      //   updateInputDemo.firstName = '';
      //   updateInputDemo.lastName = '';
      //   updateInputDemo.role = '';
      //   return updateInputDemo;
      // }
      if (updateUserInput.role) {
        throw new BadRequestException(
          `You cannot change ${user.role} to ${updateUserInput.role}`,
        );
      } else if (user.role === ROLES.USER || user.role === ROLES.MANAGER) {
        return updatedUser;
      }
    } else if (role === ROLES.MANAGER) {
      if (updateUserInput.role) {
        throw new BadRequestException(
          `You cannot change ${user.role} to ${updateUserInput.role}`,
        );
      } else if (user.role === ROLES.USER) {
        return updatedUser;
      }
    }
  }

  async remove(_id: string) {
    const user = await this.userModel.findByIdAndDelete(_id);
    if (!user) {
      throw new BadRequestException('User not deleted');
    }
    return user;
  }

  async findOne(_id?: string, email?: string, phoneNumber?: string) {
    const user = await this.userModel.findOne({
      ...(email && { email }),
      ...(_id && { _id }),
      ...(phoneNumber && { phoneNumber }),
    });
    return user;
  }

  async getUserByEmailId(email: string, role?: string) {
    const userQuery = this.userModel.findOne({ email: email });

    if (role) {
      const user = await userQuery.exec();
      if (!user) {
        throw new NotFoundException(`User not found with email: ${email}`);
      }
      if (role.toUpperCase() === ROLES.SUPERADMIN) {
        return user;
      }
      if (role.toUpperCase() === ROLES.ADMIN) {
        if (user.role === 'MANAGER' || user.role === 'USER') {
          return user;
        } else {
          throw new NotFoundException(`User not found with email: ${email}`);
        }
      }
      if (role.toUpperCase() === ROLES.MANAGER) {
        if (user.role === 'USER') {
          return user;
        } else {
          throw new NotFoundException(`User not found with email: ${email}`);
        }
      }
    }
    const user = await userQuery.exec();
    if (!user) {
      throw new NotFoundException(`User not found with email: ${email}`);
    }
    return user;
  }

  async updateRefreshTokenFromUser(email: string, hashedRefreshToken: string) {
    const user = await this.getUserByEmailId(email);
    if (user) {
      return this.userModel.findOneAndUpdate(
        { email },
        { hashedRefreshToken },
        { new: true },
      );
    }
  }

  async userLogout(email: string) {
    const user = await this.getUserByEmailId(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.hashedRefreshToken = null;
    await user.save();
    const loginResponse = `you've been logged out successfully with ${email}`;
    return loginResponse;
  }

  async forgetPassword(email: string): Promise<SendEmail> {
    const user = await this.getUserByEmailId(email);

    if (!user) {
      throw new NotFoundException(
        `user not found with ${email} email id, kindly put valid email id`,
      );
    }

    const generateRandomHexString = (length: number): string =>
      crypto.randomBytes(length / 2).toString('hex');

    const isHexStringUnique = async (hexString: string): Promise<string> => {
      const isUniqueHex = await this.emailService.checkHexIsUnique(hexString);
      return isUniqueHex;
    };

    let hexString: string;
    do {
      hexString = generateRandomHexString(32);
    } while (!isHexStringUnique(hexString));
    console.log(hexString);
    const now = new Date();
    // Get the current time in UTC
    const currentUTCTime = now.getTime() + now.getTimezoneOffset() * 60000;
    // IST is UTC+5:30, so add 5 hours and 30 minutes in milliseconds
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    // Calculate the timestamp for the next hour in IST
    const nextHourTimestamp = currentUTCTime + 60 * 60 * 1000 + istOffset;
    // Create a new Date object for the next hour in IST
    const validTillNextHour = new Date(nextHourTimestamp);
    this.emailService.sendEmailToClient(email, hexString);
    console.log({ email, hexString, validTillNextHour });

    return { email, hexString, validTillNextHour };
  }

  // async receiveForgetPasswordToken(newPassword: string, reset_token: string) {
  //   return await this.emailService.receiveForgetPasswordToken(
  //     newPassword,
  //     reset_token,
  //   );
  // }
}
