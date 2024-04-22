import { Injectable } from '@nestjs/common';
import { CreateCartInput } from './inputs/create-cart.input';
import { UpdateCartInput } from './inputs/update-cart.input';

@Injectable()
export class CartsService {
  create(createCartInput: CreateCartInput) {
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(_id: string) {
    return `This action returns a #${_id} cart`;
  }

  update(_id: string, updateCartInput: UpdateCartInput) {
    return `This action updates a #${_id} cart`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} cart`;
  }
}
