import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderitemsService } from './orderitems.service';
import { Orderitem } from './entities/orderitem.entity';
import { CreateOrderitemInput } from './inputs/create-orderitem.input';
import { UpdateOrderitemInput } from './inputs/update-orderitem.input';

@Resolver(() => Orderitem)
export class OrderitemsResolver {
  constructor(private readonly orderitemsService: OrderitemsService) {}

  @Mutation(() => Orderitem)
  createOrderitem(@Args('createOrderitemInput') createOrderitemInput: CreateOrderitemInput) {
    return this.orderitemsService.create(createOrderitemInput);
  }

  @Query(() => [Orderitem], { name: 'orderitems' })
  findAll() {
    return this.orderitemsService.findAll();
  }

  @Query(() => Orderitem, { name: 'orderitem' })
  findOne(@Args('_id', { type: () => String }) _id: string) {
    return this.orderitemsService.findOne(_id);
  }

  @Mutation(() => Orderitem)
  updateOrderitem(@Args('updateOrderitemInput') updateOrderitemInput: UpdateOrderitemInput) {
    return this.orderitemsService.update(updateOrderitemInput._id, updateOrderitemInput);
  }

  @Mutation(() => Orderitem)
  removeOrderitem(@Args('_id', { type: () => String }) _id: string) {
    return this.orderitemsService.remove(_id);
  }
}
