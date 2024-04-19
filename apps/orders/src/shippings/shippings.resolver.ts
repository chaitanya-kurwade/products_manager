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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.shippingsService.findOne(id);
  }

  @Mutation(() => Shipping)
  updateShipping(@Args('updateShippingInput') updateShippingInput: UpdateShippingInput) {
    return this.shippingsService.update(updateShippingInput.id, updateShippingInput);
  }

  @Mutation(() => Shipping)
  removeShipping(@Args('id', { type: () => Int }) id: number) {
    return this.shippingsService.remove(id);
  }
}
