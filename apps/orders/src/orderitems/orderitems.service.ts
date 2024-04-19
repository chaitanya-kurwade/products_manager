import { Injectable } from '@nestjs/common';
import { CreateOrderItemInput } from './inputs/create-orderitem.input';
import { UpdateOrderItemInput } from './inputs/update-orderitem.input';

@Injectable()
export class OrderItemsService {
  create(createOrderItemInput: CreateOrderItemInput) {
    return 'This action adds a new OrderItem';
  }

  findAll() {
    return `This action returns all OrderItems`;
  }

  findOne(_id: string) {
    return `This action returns a #${_id} OrderItem`;
  }

  update(_id: string, updateOrderItemInput: UpdateOrderItemInput) {
    return `This action updates a #${_id} OrderItem`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} OrderItem`;
  }
}
