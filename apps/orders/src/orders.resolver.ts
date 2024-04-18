import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.createOrder(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.getAllOrders();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('_id', { type: () => String }) _id: string) {
    return this.ordersService.getOneOrder(_id);
  }

  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.updateOrderById(updateOrderInput._id, updateOrderInput);
  }

  @Mutation(() => Order)
  removeOrder(@Args('_id', { type: () => String }) _id: string) {
    return this.ordersService.removeOrder(_id);
  }
}
