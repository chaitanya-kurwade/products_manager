import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubProductImage } from './sub-product-image.entity';
import { SubProductAttributes } from './sub-product-attributes.entity';
import GraphQLJSON from 'graphql-type-json';

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
  attributes: SubProductAttributes[];

  @Prop({ type: JSON })
  @Field(() => GraphQLJSON, { nullable: true })
  subVariant: JSON;

  @Prop()
  @Field({ nullable: true })
  store: string; //[hierarchies], # ref: hierarchies.yaml

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop()
  @Field(() => [SubProductImage], { nullable: false, defaultValue: [] })
  customImages: SubProductImage[]; //[String], # Image Portfolio

  @Prop()
  @Field({ nullable: false })
  sku: string;

  @Prop()
  @Field({ nullable: true })
  scope: string; //[string], # ["Suppliers", "Users", "Admin"]

  @Prop()
  @Field({ nullable: false })
  masterProductId: string; //{ type: ObjectId, ref: "MasterProduct" },

  // @Prop()
  // @Field({ nullable: false })
  // categoryId: string;

  @Prop()
  @Field({ nullable: true })
  isSameAsAMasterProductImage: boolean;

  @Prop()
  @Field({ nullable: true })
  barcode: string; //, # Barcode or QRCode

  @Prop()
  @Field({ nullable: false })
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
