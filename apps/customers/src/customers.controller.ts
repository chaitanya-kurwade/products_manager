import { Controller, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Customer } from './entities/customer.entity';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @EventPattern('user', { async: true })
  async getCustomer(@Payload() user: Customer): Promise<string> {
    // this.customersService.getCustomer(user); // not created
    console.log({ user }, 'user');
    return await ({ message: 'user processed successfully.' } + user.email);
  }
}
