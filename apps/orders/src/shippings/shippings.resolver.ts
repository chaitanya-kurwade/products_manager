import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ShippingsService } from './shippings.service';
import { Shipping } from './entities/shipping.entity';
import { CreateShippingInput } from './inputs/create-shipping.input';
import { UpdateShippingInput } from './inputs/update-shipping.input';

@Resolver(() => Shipping)
export class ShippingsResolver {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Mutation(() => Shipping)
  createShipping(@Args('createShippingInput') createShippingInput: CreateShippingInput) {
    return this.shippingsService.create(createShippingInput);
  }

  @Query(() => [Shipping], { name: 'shippings' })
  findAll() {
    return this.shippingsService.findAll();
  }

  @Query(() => Shipping, { name: 'shipping' })
  findOne(@Args('_id', { type: () => String })_id: string) {
    return this.shippingsService.findOne(_id);
  }

  @Mutation(() => Shipping)
  updateShipping(@Args('updateShippingInput') updateShippingInput: UpdateShippingInput) {
    return this.shippingsService.update(updateShippingInput._id, updateShippingInput);
  }

  @Mutation(() => Shipping)
  removeShipping(@Args('_id', { type: () => String })_id: string) {
    return this.shippingsService.remove(_id);
  }
}
