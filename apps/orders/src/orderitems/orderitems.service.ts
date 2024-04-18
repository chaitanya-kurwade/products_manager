import { Injectable } from '@nestjs/common';
import { CreateOrderitemInput } from './inputs/create-orderitem.input';
import { UpdateOrderitemInput } from './inputs/update-orderitem.input';

@Injectable()
export class OrderitemsService {
  create(createOrderitemInput: CreateOrderitemInput) {
    return 'This action adds a new orderitem';
  }

  findAll() {
    return `This action returns all orderitems`;
  }

  findOne(_id: string) {
    return `This action returns a #${_id} orderitem`;
  }

  update(_id: string, updateOrderitemInput: UpdateOrderitemInput) {
    return `This action updates a #${_id} orderitem`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} orderitem`;
  }
}
