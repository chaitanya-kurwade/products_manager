import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { Category } from '../category/entities/category.entity';
import { ImageUpload } from '../image-upload/entities/image-upload.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Product {
  @Field({ description: 'product id (placeholder)' })
  _id: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  sku: string;

  @Prop()
  @Field()
  price: number;

  @Prop()
  @Field(() => [ImageUpload])
  productImages: ImageUpload[];

  @Prop()
  @Field()
  description: string;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  @Prop()
  @Field()
  varientType: string;

  @Prop()
  @Field(() => Category)
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
