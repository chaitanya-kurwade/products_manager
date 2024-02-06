import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class SubProduct {
  @Field({ description: '_id of sub-product' })
  _id: string;

  @Prop()
  @Field({ nullable: true })
  subProductName: string;

  @Prop()
  @Field({ nullable: true })
  description: string;

  @Prop()
  @Field({ nullable: true })
  attributes: string;

  @Prop()
  @Field({ nullable: true })
  store: string; //[hierarchies], # ref: hierarchies.yaml

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop()
  @Field({ nullable: true })
  customImages: string; //[String], # Image Portfolio

  @Prop()
  @Field({ nullable: true })
  sku: string;

  @Prop()
  @Field({ nullable: true })
  scope: string; //[string], # ["Suppliers", "Users", "Admin"]

  @Prop()
  @Field({ nullable: true })
  masterProduct: string; //{ type: ObjectId, ref: "MasterProduct" },

  @Prop()
  @Field({ nullable: true })
  barcode: string; //, # Barcode or QRCode

  @Prop()
  @Field({ nullable: true })
  prices: number; //[Price], # Ref prices.yaml

  @Prop()
  @Field({ nullable: true })
  isProductReturnAble: boolean; // bool

  @Prop()
  @Field({ nullable: true })
  returnPeriod: number;

  @Prop()
  @Field({ nullable: true })
  warrantyPeriod: number;

  @Prop()
  @Field({ nullable: true })
  isExpireAble: boolean; //# To know the product can be expired

  @Prop()
  @Field({ nullable: true })
  expirationPeriod: number; //, # Expiration date from mfg date

  @Prop()
  @Field({ nullable: true })
  isReviewEnabled: boolean;

  @Prop()
  @Field({ nullable: true })
  status: string; //, # PUBLISHED, ARCHIVED, DRAFT

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
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
