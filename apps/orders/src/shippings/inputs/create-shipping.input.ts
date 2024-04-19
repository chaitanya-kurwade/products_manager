import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { TrackingInfoInput } from './tracking-info.input';
import { ShippingAddressInput } from '../../inputs/shipping-address.input';
import { CustomerInput } from '../../inputs/customer.input';
import { CreateOrderItemInput } from '../../orderitems/inputs/create-orderitem.input';

@InputType()
export class CreateShippingInput {
  @Field(() => String, { nullable: true })
  trackingNumber?: string;

  @Field(() => String, { nullable: true })
  orderId?: string;

  @Field(() => String, { nullable: true })
  orderNumber?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  orderDate?: Date;

  @Field(() => String, { nullable: true })
  shippingMethod?: string;

  @Field(() => String, { nullable: true })
  carrier?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  shippedDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  expectedDeliveryDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deliveredDate?: Date;

  @Field(() => String, { nullable: true })
  status?: string; // In-transits, cancelled, delivered, out for delivery

  @Field(() => Int, { nullable: true })
  shippingCost?: number;

  @Field(() => [TrackingInfoInput], { nullable: true })
  trackingInfo?: TrackingInfoInput[];

  @Field(() => ShippingAddressInput, { nullable: true })
  shippingAddress?: ShippingAddressInput;

  @Field(() => CustomerInput, { nullable: true })
  customer?: CustomerInput;

  @Field(() => [CreateOrderItemInput], { nullable: true })
  orderItems?: CreateOrderItemInput[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
