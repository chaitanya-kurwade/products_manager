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

  findOne(_id: string) {
    return `This action returns a #${_id} shipping`;
  }

  update(_id: string, updateShippingInput: UpdateShippingInput) {
    return `This action updates a #${_id} shipping`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} shipping`;
  }
}
