import { InputType, Field } from '@nestjs/graphql';
import { MasterProductAttributesInput } from './master-product-attributes.input';
import { MasterProductImageInput } from './master-product-image.input';

@InputType()
export class CreateMasterProductInput {
  @Field({ nullable: false })
  masterProductName: string;

  @Field({ nullable: false })
  description: string;

  @Field({ nullable: false })
  icon: string;

  @Field(() => [MasterProductImageInput], { nullable: false, defaultValue: [] })
  images: MasterProductImageInput[]; //json

  @Field({ nullable: false })
  sku: string;

  @Field({ nullable: false })
  status: string;

  @Field({ nullable: false })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Field({ nullable: false })
  categoryId: string; //ObjectId,  # { ref: categories.yaml }

  @Field(() => [MasterProductAttributesInput], {
    nullable: false,
    defaultValue: [],
  })
  attriburtes: MasterProductAttributesInput[]; //json

  @Field({ nullable: false })
  tags: string; //string[]

  @Field({ nullable: false })
  metaTags: string; //string[] SEO

  @Field({ nullable: false })
  sortingOrder: number;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // createdAt: Date;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // updatedAt: Date;

  @Field({ nullable: false })
  specification: string; //[JSON],

  @Field({ nullable: false })
  isProductReturnAble: boolean;

  @Field({ nullable: false })
  returnPeriod: string; //# Number,

  @Field({ nullable: false })
  warrantyPeriod: string; // #Number,

  @Field({ nullable: false })
  isExpireAble: string; //Boolean, # To know the product can be expired

  @Field({ nullable: false })
  expirationPeriod: string; //#Number, # Expiration date from mfg date

  @Field({ nullable: false })
  isReviewEnabled: boolean; //boolean,

  @Field({ nullable: false })
  Brand: string; //String,

  @Field({ nullable: false })
  originCountry: string; //String,

  @Field({ nullable: false })
  visibility: string; //JSON, # To show details location wise

  @Field({ nullable: false })
  products: string; //[ObjectId], # related products

  ///////////////////////////////
  @Field({ nullable: false })
  price: number;

  @Field({ nullable: false })
  varientType: string;

  // @Field(() => Category, { nullable: false })
  // category: Category;
}
/**
 * 
 * # Only super admin can create
  _id: String,
  name: String,
  description: String,
  icon: String,
  images: [{ attribute: JSON, images: [String] }], # Image Portfolio
  # sku: String,
  status: String, # PUBLISHED, ARCHIVED, DRAFT
  scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]
  categories: ObjectId, # { ref: categories.yaml }
  attributes: JSON, # { language: String, cover: String} for books, { color: String, size: String } for T-Shirts
  tags: [String], # Add any tags here for searching and filtering
  metaTags: [String], # SEO
  # sortingOrder: Number,
  updatedAt: Date,
  createdAt: Date,
  specification: [JSON],
  isProductReturnAble: Boolean,
  # returnPeriod: Number,
  # warrantyPeriod: Number,
  isExpireAble: Boolean, # To know the product can be expired
  # expirationPeriod: Number, # Expiration date from mfg date
  isReviewEnabled: boolean,
  # recentReviews: [
  #     {
  #       review_id: ObjectId,
  #       orderId: ObjectId, #ref: OrderItems
  #       customer: { CustomerId: ObjectId, name: String },
  #       image: [String],
  #       comment: String,
  #       rating: Number,
  #       createdAt: Date,
  #       updatedAt: Date,
  #       status: String, # PUBLISHED, ARCHIVED, DRAFT
  #     },
  #   ],
  # manufacturer:
  #   { manufacturerId: String, name: String, partNumber: String, icon: String },
  Brand: String,
  originCountry: String,
  visibility: JSON, # To show details location wise
  products: [ObjectId], # related products
 * 
 * 
*/
