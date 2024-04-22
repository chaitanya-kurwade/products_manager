import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './inputs/create-cart.input';
import { UpdateCartInput } from './inputs/update-cart.input';

@Resolver(() => Cart)
export class CartsResolver {
  constructor(private readonly cartsService: CartsService) {}

  @Mutation(() => Cart)
  createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
    return this.cartsService.create(createCartInput);
  }

  @Query(() => [Cart], { name: 'carts' })
  findAll() {
    return this.cartsService.findAll();
  }

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('_id', { type: () => String }) _id: string) {
    return this.cartsService.findOne(_id);
  }

  @Mutation(() => Cart)
  updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    return this.cartsService.update(updateCartInput._id, updateCartInput);
  }

  @Mutation(() => Cart)
  removeCart(@Args('_id', { type: () => String }) _id: string) {
    return this.cartsService.remove(_id);
  }
}
