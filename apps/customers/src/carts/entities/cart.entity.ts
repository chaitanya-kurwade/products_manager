import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Cart {
  @Field(() => String, { description: 'cart _id' })
  _id: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = Cart & Document;