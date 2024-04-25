import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { MasterProductImage } from './master-product-image.entity';
import { MasterProductAttributes } from './master-product-attributes.entity';

@Schema({ timestamps: true })
@ObjectType()
export class MasterProduct {
  @Field()
  _id: string;

  @Prop()
  @Field({ nullable: false })
  masterProductName: string;

  @Prop()
  @Field({ nullable: false })
  description: string;

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop()
  @Field(() => [MasterProductImage], { nullable: false, defaultValue: [] })
  images: MasterProductImage[]; //json

  @Prop()
  @Field({ nullable: false })
  sku: string;

  @Prop()
  @Field({ nullable: false })
  status: string;

  @Prop()
  @Field({ nullable: true })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Prop()
  @Field(() => Category, { nullable: false })
  category: Category; //ObjectId,  # { ref: categories.yaml }

  @Prop()
  @Field(() => [MasterProductAttributes], { nullable: false, defaultValue: [] })
  attributes: MasterProductAttributes[]; //json[]

  @Prop()
  @Field({ nullable: true })
  tags: string; //string[]

  @Prop()
  @Field({ nullable: true })
  metaTags: string; //string[] SEO

  @Prop()
  @Field({ nullable: true })
  sortingOrder: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: true })
  specification: string; //[JSON],

  @Prop()
  @Field({ nullable: true })
  isProductReturnAble: boolean;

  @Prop()
  @Field({ nullable: true })
  returnPeriod: string; //# Number,

  @Prop()
  @Field({ nullable: true })
  warrantyPeriod: string; // #Number,

  @Prop()
  @Field({ nullable: true })
  isExpireAble: string; //Boolean, # To know the product can be expired

  @Prop()
  @Field({ nullable: true })
  expirationPeriod: string; //#Number, # Expiration date from mfg date

  @Prop()
  @Field({ nullable: true })
  isReviewEnabled: boolean; //boolean,

  @Prop()
  @Field({ nullable: true })
  Brand: string; //String,

  @Prop()
  @Field({ nullable: true })
  originCountry: string; //String,

  @Prop()
  @Field({ nullable: true })
  visibility: string; //JSON, # To show details location wise

  @Prop()
  @Field({ nullable: true })
  products: string; //[ObjectId], # related products

  @Prop()
  @Field({ nullable: true })
  varientType: string;
}
export const MasterProductSchema = SchemaFactory.createForClass(MasterProduct);
export type MasterProductDocument = MasterProduct & Document;
