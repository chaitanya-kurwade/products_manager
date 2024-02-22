import { InputType, Field } from '@nestjs/graphql';
import { MasterProductAttributesInput } from './master-product-attributes.input';
import { MasterProductImageInput } from './master-product-image.input';

@InputType()
export class CreateMasterProductInput {
  @Field({ nullable: false })
  masterProductName: string;

  @Field({ nullable: false })
  description: string;

  @Field({ nullable: true })
  icon: string;

  @Field(() => [MasterProductImageInput], { nullable: false, defaultValue: [] })
  images: MasterProductImageInput[]; //json

  @Field({ nullable: false })
  sku: string;

  @Field({ nullable: false })
  status: string;

  @Field({ nullable: true })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Field({ nullable: false })
  categoryId: string; //ObjectId,  # { ref: categories.yaml }

  @Field(() => [MasterProductAttributesInput], {
    nullable: false,
    defaultValue: [],
  })
  attributes: MasterProductAttributesInput[]; //json

  @Field({ nullable: true })
  tags: string; //string[]

  @Field({ nullable: true })
  metaTags: string; //string[] SEO

  @Field({ nullable: true })
  sortingOrder: number;

  @Field({ nullable: true })
  specification: string; //[JSON],

  @Field({ nullable: true })
  isProductReturnAble: boolean;

  @Field({ nullable: true })
  returnPeriod: string; //# Number,

  @Field({ nullable: true })
  warrantyPeriod: string; // #Number,

  @Field({ nullable: true })
  isExpireAble: string; //Boolean, # To know the product can be expired

  @Field({ nullable: true })
  expirationPeriod: string; //#Number, # Expiration date from mfg date

  @Field({ nullable: true })
  isReviewEnabled: boolean; //boolean,

  @Field({ nullable: true })
  Brand: string; //String,

  @Field({ nullable: true })
  originCountry: string; //String,

  @Field({ nullable: true })
  visibility: string; //JSON, # To show details location wise

  @Field({ nullable: true })
  products: string; //[ObjectId], # related products

  @Field({ nullable: true })
  varientType: string;
}
