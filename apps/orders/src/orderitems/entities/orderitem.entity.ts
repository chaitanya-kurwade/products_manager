import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './product.entity';
import { CURRENCY } from '../enums/currency.enum';
import { ORDER_STATUS } from '../enums/order-status.enum';

@ObjectType()
@Schema({ timestamps: true })
export class OrderItem extends Document {
  @Field(() => String, { description: 'OrderItem _id' })
  _id: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number })
  orderNumber?: number;

  @Field(() => Product, { nullable: true })
  @Prop({ type: Product })
  product?: Product;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number })
  quantity?: number;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number })
  unitPrice?: number;

  // @Field(() => String, { nullable: true })
  @Prop({ enum: CURRENCY, type: String })
  currency?: CURRENCY;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  supplierId?: string;

  // @Field(() => String, { nullable: true })
  @Prop({ enum: ORDER_STATUS, type: String })
  status?: ORDER_STATUS;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export type OrderItemDocument = OrderItem & Document;