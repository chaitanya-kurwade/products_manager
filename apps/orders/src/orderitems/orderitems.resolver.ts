import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderItemsService } from './orderitems.service';
import { OrderItem } from './entities/orderitem.entity';
import { CreateOrderItemInput } from './inputs/create-orderitem.input';
import { UpdateOrderItemInput } from './inputs/update-orderitem.input';

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  constructor(private readonly OrderItemsService: OrderItemsService) {}

  @Mutation(() => OrderItem)
  createOrderItem(@Args('createOrderItemInput') createOrderItemInput: CreateOrderItemInput) {
    return this.OrderItemsService.create(createOrderItemInput);
  }

  @Query(() => [OrderItem], { name: 'OrderItems' })
  findAll() {
    return this.OrderItemsService.findAll();
  }

  @Query(() => OrderItem, { name: 'OrderItem' })
  findOne(@Args('_id', { type: () => String }) _id: string) {
    return this.OrderItemsService.findOne(_id);
  }

  @Mutation(() => OrderItem)
  updateOrderItem(@Args('updateOrderItemInput') updateOrderItemInput: UpdateOrderItemInput) {
    return this.OrderItemsService.update(updateOrderItemInput._id, updateOrderItemInput);
  }

  @Mutation(() => OrderItem)
  removeOrderItem(@Args('_id', { type: () => String }) _id: string) {
    return this.OrderItemsService.remove(_id);
  }
}
