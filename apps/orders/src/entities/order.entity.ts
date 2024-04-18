import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ORDER_STATUS } from '../enums/order-status.enum';
import { PAYMENT_TYPE } from '../enums/payment-method.enum';
import { PAYMENT_STATUS } from '../enums/payment-status.enum';

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => String, { description: "Order _id" })
  _id: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  orderNumber: number;

  @Field(() => String, { nullable: true }) // Customer
  @Prop()
  customer: {
    customerId: string;
    title: string;
    firstName: string;
    lastName: string;
    phoneNumber: { countryCode: string; phoneNumber: string };
    email: string;
  };

  @Field(() => String, { nullable: true }) // ShippingAddress
  @Prop()
  shippingAddress: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Field(() => [String], { nullable: true })
  @Prop()
  items: string[]; // OrderItem[];

  @Field(() => Int, { nullable: true })
  @Prop()
  total: number;

  @Field(() => String, { nullable: true })
  @Prop({ enum: ORDER_STATUS, type: String })
  status: ORDER_STATUS; //'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Field(() => String, { nullable: true })
  @Prop({ enum: PAYMENT_TYPE, type: String })
  paymentType: PAYMENT_TYPE; //'CARD' | 'UPI' | 'NET BANKING' | 'COD';

  @Field(() => String, { nullable: true })
  @Prop({ enum: PAYMENT_STATUS, type: String })
  paymentStatus: PAYMENT_STATUS; // 'Paid' | 'to be paid';

  @Field(() => [String], { nullable: true })
  @Prop()
  transactions: string[]; // Transaction[];

  @Field(() => [String], { nullable: true })
  @Prop()
  shippings: string[]; //Shipping[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ default: new Date()})
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ default: new Date()})
  updatedAt: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);