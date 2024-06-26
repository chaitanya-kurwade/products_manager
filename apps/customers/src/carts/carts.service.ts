import { Inject, Injectable } from '@nestjs/common';
import { CreateCartInput } from './inputs/create-cart.input';
import { UpdateCartInput } from './inputs/update-cart.input';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @Inject('products') private readonly productsClient: ClientProxy,
  ) {}

  async addProductToCart(subProduct: any) {
    return subProduct;
  }

  async create(createCartInput: CreateCartInput) {
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
