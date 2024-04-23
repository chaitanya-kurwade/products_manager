import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @EventPattern('user', { async: true })
  async getCustomer(@Payload() user: User): Promise<string> {
    // this.customersService.getCustomer(user); // not created
    console.log({ user }, 'user, controller');
    return await ({ message: 'user processed successfully.' } + user.email);
  }
}
