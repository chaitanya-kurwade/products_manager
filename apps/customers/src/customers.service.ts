import { BadGatewayException, BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { UpdateCustomerInput } from './inputs/update-customer.input';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './entities/customer.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'common/library/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerResponse } from './responses/customer.response.entity';
import { LoginResponse } from './responses/customer-login.response.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService) { }

  // async signupCustomer(createCustomerInput: CreateCustomerInput): Promise<Customer> {
  //   const existingCustomer = await this.customerModel.findOne({ email: createCustomerInput.email });
  //   if (existingCustomer) {
  //     throw new BadRequestException(`user already exists with email: ${existingCustomer.email}`);
  //   }
  //   const hashedPassword = await bcrypt.hash(createCustomerInput.password);
  //   return await this.customerModel.create({ ...createCustomerInput, password: hashedPassword, isEmailVerified: false, hashedRefreshToken: '', role: ROLES.USER });
  // }

  // async findAll(): Promise<Customer[]> {
  //   const customers = await this.customerModel.find().exec();
  //   if (!customers || customers.length === 0) {
  //     throw new NotFoundException('users not found');
  //   }
  //   return customers;
  // }

  // async findOne(_id: string): Promise<Customer> {
  //   const customer = await this.customerModel.findById(_id);
  //   if (!customer) {
  //     throw new NotFoundException(`user not found: _id:- ${_id}`);
  //   }
  //   return customer;
  // }

  // async update(_id: string, updateCustomerInput: UpdateCustomerInput): Promise<Customer> {
  //   const customer = await this.customerModel.findByIdAndUpdate(_id, updateCustomerInput);
  //   if (!customer) {
  //     throw new NotFoundException(`user not updated: _id:- ${_id}`);
  //   }
  //   return customer;
  // }

  // async remove(_id: string): Promise<Customer> {
  //   const customer = await this.customerModel.findById(_id);
  //   if (!customer) {
  //     throw new NotFoundException(`user not deleted: _id:- ${_id}`);
  //   }
  //   return customer;
  // }
}
