import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ORDER_STATUS } from '../enums/order-status.enum';
import { PAYMENT_TYPE } from '../enums/payment-method.enum';
import { PAYMENT_STATUS } from '../enums/payment-status.enum';
import { Customer } from './customer.entity';
import { ShippingAddress } from './shipping-address.entity';
import { OrderItem } from '../orderitems/entities/orderitem.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => String, { description: "Order _id" })
  _id: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  orderNumber: number;

  @Field(() => Customer, { nullable: true }) // Customer
  @Prop()
  customer: Customer;

  @Field(() => ShippingAddress, { nullable: true }) // ShippingAddress
  @Prop()
  shippingAddress: ShippingAddress;

  @Field(() => [OrderItem], { nullable: true })
  @Prop()
  items: OrderItem[]; // OrderItem[];

  @Field(() => Int, { nullable: true })
  @Prop()
  total: number;

  @Field(() => String, { nullable: true })
  @Prop({ enum: ORDER_STATUS, type: String })
  status: ORDER_STATUS;

  @Field(() => String, { nullable: true })
  @Prop({ enum: PAYMENT_TYPE, type: String })
  paymentType: PAYMENT_TYPE;

  @Field(() => String, { nullable: true })
  @Prop({ enum: PAYMENT_STATUS, type: String })
  paymentStatus: PAYMENT_STATUS;

  @Field(() => [String], { nullable: true })
  @Prop()
  transactions: string[]; // Transaction[];

  @Field(() => [String], { nullable: true })
  @Prop()
  shippings: string[]; //Shipping[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);