import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubProductImage } from './sub-product-image.entity';
import { SubProductAttributes } from './sub-product-attributes.entity';

@Schema({ timestamps: true })
@ObjectType()
export class SubProduct {
  @Field({ description: '_id of sub-product' })
  _id: string;

  @Prop()
  @Field({ nullable: false })
  subProductName: string;

  @Prop()
  @Field({ nullable: false })
  description: string;

  @Prop()
  @Field(() => [SubProductAttributes], { nullable: false, defaultValue: [] })
  attriburtes: SubProductAttributes[];

  @Prop()
  @Field({ nullable: false })
  store: string; //[hierarchies], # ref: hierarchies.yaml

  @Prop()
  @Field({ nullable: false })
  icon: string;

  @Prop()
  @Field(() => [SubProductImage], { nullable: false, defaultValue: [] })
  customImages: SubProductImage[]; //[String], # Image Portfolio

  @Prop()
  @Field({ nullable: false })
  sku: string;

  @Prop()
  @Field({ nullable: false })
  scope: string; //[string], # ["Suppliers", "Users", "Admin"]

  @Prop()
  @Field({ nullable: false })
  masterProduct: string; //{ type: ObjectId, ref: "MasterProduct" },

  @Prop()
  @Field({ nullable: false })
  barcode: string; //, # Barcode or QRCode

  @Prop()
  @Field({ nullable: false })
  prices: number; //[Price], # Ref prices.yaml

  @Prop()
  @Field({ nullable: false })
  isProductReturnAble: boolean; // bool

  @Prop()
  @Field({ nullable: false })
  returnPeriod: number;

  @Prop()
  @Field({ nullable: false })
  warrantyPeriod: number;

  @Prop()
  @Field({ nullable: false })
  isExpireAble: boolean; //# To know the product can be expired

  @Prop()
  @Field({ nullable: false })
  expirationPeriod: number; //, # Expiration date from mfg date

  @Prop()
  @Field({ nullable: false })
  isReviewEnabled: boolean;

  @Prop()
  @Field({ nullable: false })
  status: string; //, # PUBLISHED, ARCHIVED, DRAFT

  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: false })
  updatedAt: Date;
}

export const SubProductSchema = SchemaFactory.createForClass(SubProduct);
export type SubPorductDocument = SubProduct & Document;
/*
{
  _id: string,
  name: string,
  description: string,
  store: [hierarchies], # ref: hierarchies.yaml
  icon: string,
  customImages: [String], # Image Portfolio
  sku: String,
  scope: [string], # ["Suppliers", "Users", "Admin"]
  MasterProduct: { type: ObjectId, ref: "MasterProduct" },
  barcode: String, # Barcode or QRCode
  prices: [Price], # Ref prices.yaml
  isProductReturnAble: Boolean,
  returnPeriod: Number,
  warrantyPeriod: Number,
  isExpireAble: Boolean, # To know the product can be expired
  expirationPeriod: Number, # Expiration date from mfg date
  isReviewEnabled: boolean,
  // recentReviews: [
  //     {
  //       review_id: ObjectId,
  //       orderId: ObjectId, #ref: OrderItems
  //       customer: { CustomerId: ObjectId, name: String },
  //       image: [String],
  //       comment: String,
  //       rating: Number,
  //       createdAt: Date,
  //       updatedAt: Date,
  //       status: String, # PUBLISHED, ARCHIVED, DRAFT
  //     },
  //   ],
  // manufacturer:
  //   { manufacturerId: String, name: String, partNumber: String, icon: String },
  // Brand: String,
  // originCountry: String,
  // visibility: JSON, # To show details location wise
  // products: [ObjectId], # related products
  status: string, # PUBLISHED, ARCHIVED, DRAFT
  updatedAt: Date,
  createdAt: Date,
}

*/
