import { InputType, Field } from '@nestjs/graphql';
import { SubProductImageInput } from './sub-product-image.input';
import { SubProductAttributesInput } from './sub-product-attributes.input';

@InputType()
export class CreateSubProductInput {
  @Field({ nullable: true })
  subProductName: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [SubProductAttributesInput], {
    nullable: true,
    defaultValue: [],
  })
  attributes: SubProductAttributesInput[];

  @Field({ nullable: true })
  store: string; //[hierarchies], # ref: hierarchies.yaml

  @Field({ nullable: true })
  icon: string;

  @Field(() => [SubProductImageInput], { nullable: true, defaultValue: [] })
  customImages: SubProductImageInput[]; //json//[String], # Image Portfolio

  @Field({ nullable: true })
  sku: string;

  @Field({ nullable: true })
  scope: string; //[string], # ["Suppliers", "Users", "Admin"]

  @Field({ nullable: true })
  masterProduct: string; //{ type: ObjectId, ref: "MasterProduct" },

  @Field({ nullable: true })
  barcode: string; //, # Barcode or QRCode

  @Field({ nullable: true })
  prices: number; //[Price], # Ref prices.yaml

  @Field({ nullable: true })
  isProductReturnAble: boolean; // bool

  @Field({ nullable: true })
  returnPeriod: number;

  @Field({ nullable: true })
  warrantyPeriod: number;

  @Field({ nullable: true })
  isExpireAble: boolean; //# To know the product can be expired

  @Field({ nullable: true })
  expirationPeriod: number; //, # Expiration date from mfg date

  @Field({ nullable: true })
  isReviewEnabled: boolean;

  @Field({ nullable: true })
  status: string; //, # PUBLISHED, ARCHIVED, DRAFT

  // @Field(() => GraphQLISODateTime, { nullable: true })
  // updatedAt: Date;

  // @Field(() => GraphQLISODateTime, { nullable: true })
  // createdAt: Date;
}
