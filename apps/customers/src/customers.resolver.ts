import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { UpdateCustomerInput } from './inputs/update-customer.input';
import { LoginCustomerInput } from './inputs/login-customer.input';
import { LoginResponse } from './responses/customer-login.response.entity';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  // @Mutation(() => Customer)
  // signupCustomer(@Args('signupCustomerInput') createCustomerInput: CreateCustomerInput) {
  //   return this.customersService.signupCustomer(createCustomerInput);
  // }

  // @Mutation(() => LoginResponse)
  // loginCustomer(@Args('loginCustomerInput') loginCustomerInput: LoginCustomerInput) {
  //   return this.customersService.loginCustomer(loginCustomerInput.userCredential, loginCustomerInput.passwordOrOtp);
  // }

  // @Query(() => [Customer], { name: 'customers' })
  // findAll() {
  //   return this.customersService.findAll();
  // }

  // @Query(() => Customer, { name: 'customer' })
  // findOne(@Args('_id') _id: string) {
  //   return this.customersService.findOne(_id);
  // }

  // @Mutation(() => Customer)
  // updateCustomer(@Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput) {
  //   return this.customersService.update(updateCustomerInput._id, updateCustomerInput);
  // }

  // @Mutation(() => Customer)
  // removeCustomer(@Args('_id') _id: string) {
  //   return this.customersService.remove(_id);
  // }
}
