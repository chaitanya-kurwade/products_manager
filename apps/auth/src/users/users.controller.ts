import { Controller } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  @EventPattern('updateEmailVerificationStatus', { async: true })
  async updateEmailVerificationStatus(@Payload() userId: string): Promise<User> {
    return this.usersService.updateEmailVerificationStatus(userId);
  }

  @EventPattern('createPassword', { async: true })
  async createPassword(@Payload() userEntity: any): Promise<User | string> {
    return this.usersService.createPassword(userEntity.email, userEntity.newPassword);
  }

  @EventPattern('forgetPassword', { async: true })
  async forgetPassword(@Payload() userEntity: any): Promise<User | string> {
    const userResponse = await this.usersService.forgetPassword(userEntity.email, userEntity.newPassword);
    return userResponse;
  }
}
