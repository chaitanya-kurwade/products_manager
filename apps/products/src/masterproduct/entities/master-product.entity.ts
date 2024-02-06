import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from '../../category/entities/category.entity';

@Schema({ timestamps: true })
@ObjectType()
export class MasterProduct {
  @Field()
  _id: string;

  @Prop()
  @Field({ nullable: true })
  masterProductName: string;

  @Prop()
  @Field({ nullable: true })
  description: string;

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop()
  @Field({ nullable: true })
  images: string; //json

  @Prop()
  @Field({ nullable: true })
  sku: string;

  @Prop()
  @Field({ nullable: true })
  status: string;

  @Prop()
  @Field({ nullable: true })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Prop()
  @Field(() => Category)
  category: Category; //ObjectId,  # { ref: categories.yaml }

  @Prop()
  @Field({ nullable: true })
  attriburtes: string; //json[]

  @Prop()
  @Field({ nullable: true })
  tags: string; //string[]

  @Prop()
  @Field({ nullable: true })
  metaTags: string; //string[] SEO

  @Prop()
  @Field({ nullable: true })
  sortingOrder: number;

  // @Prop()
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop()
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

  ///////////////////////////////
  @Prop()
  @Field({ nullable: true })
  price: number;

  @Prop()
  @Field({ nullable: true })
  varientType: string;

  // @Prop()
  // @Field(() => Category, { nullable: true })
  // category: Category;

  // @Prop()
  // @Field({ nullable: true })
  // name: string;

  // @Prop()
  // @Field({ nullable: true })
  // sku: string;

  // @Prop()
  // @Field({ nullable: true })
  // price: number;

  // @Prop()
  // @Field({ nullable: true })
  // description: string;

  // // @Prop({ type: Date, required: true, default: new Date() })
  // @Field(() => GraphQLISODateTime, { nullable: true })
  // createdAt: Date;

  // // @Prop({ type: Date, required: true, default: new Date() })
  // @Field(() => GraphQLISODateTime, { nullable: true })
  // updatedAt: Date;

  // @Prop()
  // @Field({ nullable: true })
  // varientType: string;

  // @Prop()
  // @Field(() => Category, { nullable: true })
  // category: Category;
}
export const MasterProductSchema = SchemaFactory.createForClass(MasterProduct);
export type MasterProductDocument = MasterProduct & Document;
