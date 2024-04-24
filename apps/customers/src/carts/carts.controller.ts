import { Controller } from '@nestjs/common';
// import { EventPattern, Payload } from '@nestjs/microservices';
import { CartsService } from './carts.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { User } from '../entities/user.entity';
// import { User } from '../entities/user.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  // @EventPattern('user', { async: true })
  // async getCustomer(@Payload() user: User): Promise<string> {
  //   this.cartsService.saveCustomer(user); // not created
  //   console.log({ user }, 'user, controller');
  //   return ({ message: 'user processed successfully.' } + user.email);
  // }
}
