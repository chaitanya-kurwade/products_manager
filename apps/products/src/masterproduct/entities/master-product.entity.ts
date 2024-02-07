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
  @Field({ nullable: false })
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
  @Field({ nullable: false })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Prop()
  @Field(() => Category, { nullable: false })
  category: Category; //ObjectId,  # { ref: categories.yaml }

  @Prop()
  @Field(() => [MasterProductAttributes], { nullable: false, defaultValue: [] })
  attriburtes: MasterProductAttributes[]; //json[]

  @Prop()
  @Field({ nullable: false })
  tags: string; //string[]

  @Prop()
  @Field({ nullable: false })
  metaTags: string; //string[] SEO

  @Prop()
  @Field({ nullable: false })
  sortingOrder: number;

  // @Prop()
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  // @Prop()
  @Field(() => GraphQLISODateTime, { nullable: false })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: false })
  specification: string; //[JSON],

  @Prop()
  @Field({ nullable: false })
  isProductReturnAble: boolean;

  @Prop()
  @Field({ nullable: false })
  returnPeriod: string; //# Number,

  @Prop()
  @Field({ nullable: false })
  warrantyPeriod: string; // #Number,

  @Prop()
  @Field({ nullable: false })
  isExpireAble: string; //Boolean, # To know the product can be expired

  @Prop()
  @Field({ nullable: false })
  expirationPeriod: string; //#Number, # Expiration date from mfg date

  @Prop()
  @Field({ nullable: false })
  isReviewEnabled: boolean; //boolean,

  @Prop()
  @Field({ nullable: false })
  Brand: string; //String,

  @Prop()
  @Field({ nullable: false })
  originCountry: string; //String,

  @Prop()
  @Field({ nullable: false })
  visibility: string; //JSON, # To show details location wise

  @Prop()
  @Field({ nullable: false })
  products: string; //[ObjectId], # related products

  ///////////////////////////////
  @Prop()
  @Field({ nullable: false })
  price: number;

  @Prop()
  @Field({ nullable: false })
  varientType: string;

  // @Prop()
  // @Field(() => Category, { nullable: false })
  // category: Category;

  // @Prop()
  // @Field({ nullable: false })
  // name: string;

  // @Prop()
  // @Field({ nullable: false })
  // sku: string;

  // @Prop()
  // @Field({ nullable: false })
  // price: number;

  // @Prop()
  // @Field({ nullable: false })
  // description: string;

  // // @Prop({ type: Date, required: false, default: new Date() })
  // @Field(() => GraphQLISODateTime, { nullable: false })
  // createdAt: Date;

  // // @Prop({ type: Date, required: false, default: new Date() })
  // @Field(() => GraphQLISODateTime, { nullable: false })
  // updatedAt: Date;

  // @Prop()
  // @Field({ nullable: false })
  // varientType: string;

  // @Prop()
  // @Field(() => Category, { nullable: false })
  // category: Category;
}
export const MasterProductSchema = SchemaFactory.createForClass(MasterProduct);
export type MasterProductDocument = MasterProduct & Document;
