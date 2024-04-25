import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Schema, Prop } from '@nestjs/mongoose';
import { OrderItem } from '../../orderitems/entities/orderitem.entity';
import { Customer } from '../../entities/customer.entity';
import { ShippingAddress } from '../../entities/shipping-address.entity';
import { TrackingInfo } from './tracking-info.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Shipping {
  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  trackingNumber?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  orderId?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  orderNumber?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  orderDate?: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  shippingMethod?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  carrier?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  shippedDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  expectedDeliveryDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  deliveredDate?: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  status?: string; // In-transits, cancelled, delivered, out for delivery

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number })
  shippingCost?: number;

  @Field(() => [TrackingInfo], { nullable: true })
  @Prop()
  trackingInfo?: TrackingInfo[];

  @Field(() => ShippingAddress, { nullable: true })
  @Prop()
  shippingAddress?: ShippingAddress;

  @Field(() => Customer, { nullable: true })
  @Prop()
  customer?: Customer;

  @Field(() => [OrderItem], { nullable: true })
  @Prop()
  orderItems?: OrderItem[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  updatedAt?: Date;
}