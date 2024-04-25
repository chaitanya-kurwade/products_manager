import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import { SubProduct } from './sub-product.entity';

@ObjectType()
export class Cart {
  @Field(() => String, { description: 'cart _id', nullable: true })
  _id: string;

  @Field(() => String, { description: 'customer _id', nullable: true })
  customerId: string;

  @Field(() => [SubProduct], { description: 'product', nullable: true })
  subProduct: SubProduct[];

  // @Field(() => Int, { description: 'totoalQuantity', nullable: true })
  // totoalQuantity: number;

  // @Field(() => Int, { description: 'totoalPrice', nullable: true })
  // totoalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export type CartDocument = Cart & Document;
