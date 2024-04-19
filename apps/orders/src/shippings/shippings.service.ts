import { Injectable } from '@nestjs/common';
import { CreateShippingInput } from './inputs/create-shipping.input';
import { UpdateShippingInput } from './inputs/update-shipping.input';

@Injectable()
export class ShippingsService {
  create(createShippingInput: CreateShippingInput) {
    return 'This action adds a new shipping';
  }

  findAll() {
    return `This action returns all shippings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipping`;
  }

  update(id: number, updateShippingInput: UpdateShippingInput) {
    return `This action updates a #${id} shipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipping`;
  }
}
