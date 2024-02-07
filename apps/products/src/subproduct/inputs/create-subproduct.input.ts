import { InputType, Field } from '@nestjs/graphql';
import { SubProductImageInput } from './sub-product-image.input';
import { SubProductAttributesInput } from './sub-product-attributes.input';

@InputType()
export class CreateSubProductInput {
  @Field({ nullable: false })
  subProductName: string;

  @Field({ nullable: false })
  description: string;

  @Field(() => [SubProductAttributesInput], {
    nullable: false,
    defaultValue: [],
  })
  attributes: SubProductAttributesInput[];

  @Field({ nullable: false })
  store: string; //[hierarchies], # ref: hierarchies.yaml

  @Field({ nullable: false })
  icon: string;

  @Field(() => [SubProductImageInput], { nullable: false, defaultValue: [] })
  customImages: SubProductImageInput[]; //json//[String], # Image Portfolio

  @Field({ nullable: false })
  sku: string;

  @Field({ nullable: false })
  scope: string; //[string], # ["Suppliers", "Users", "Admin"]

  @Field({ nullable: false })
  masterProduct: string; //{ type: ObjectId, ref: "MasterProduct" },

  @Field({ nullable: false })
  barcode: string; //, # Barcode or QRCode

  @Field({ nullable: false })
  prices: number; //[Price], # Ref prices.yaml

  @Field({ nullable: false })
  isProductReturnAble: boolean; // bool

  @Field({ nullable: false })
  returnPeriod: number;

  @Field({ nullable: false })
  warrantyPeriod: number;

  @Field({ nullable: false })
  isExpireAble: boolean; //# To know the product can be expired

  @Field({ nullable: false })
  expirationPeriod: number; //, # Expiration date from mfg date

  @Field({ nullable: false })
  isReviewEnabled: boolean;

  @Field({ nullable: false })
  status: string; //, # PUBLISHED, ARCHIVED, DRAFT

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // updatedAt: Date;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // createdAt: Date;
}
