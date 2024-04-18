import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';

@Injectable()
export class OrdersService {
  create(createOrderInput: CreateOrderInput) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(_id: string) {
    return `This action returns a #${_id} order`;
  }

  update(_id: string, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${_id} order`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} order`;
  }
}
