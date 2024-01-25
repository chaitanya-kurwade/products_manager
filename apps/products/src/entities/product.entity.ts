import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { Category } from '../category/entities/category.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Product {
  @Field({ description: 'product id (placeholder)' })
  _id: string;

  @Prop()
  @Field({ nullable: true })
  name: string;

  @Prop()
  @Field({ nullable: true })
  sku: string;

  @Prop()
  @Field({ nullable: true })
  price: number;

  @Prop()
  @Field({ nullable: true })
  description: string;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: true })
  varientType: string;

  @Prop()
  @Field(() => Category, { nullable: true })
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
