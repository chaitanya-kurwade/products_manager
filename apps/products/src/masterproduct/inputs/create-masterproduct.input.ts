import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateMasterProductInput {
  @Field()
  _id: string;

  @Field({ nullable: true })
  masterProductName: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: true })
  images: string; //json

  @Field({ nullable: true })
  sku: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  scope: string; //scope: [String], # [ 'Suppliers', 'Users', 'Admin' ]

  @Field({ nullable: true })
  categories: string; //ObjectId,  # { ref: categories.yaml }

  @Field({ nullable: true })
  attriburtes: string; //json

  @Field({ nullable: true })
  tags: string; //string[]

  @Field({ nullable: true })
  metaTags: string; //string[] SEO

  @Field({ nullable: true })
  sortingOrder: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

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

  ///////////////////////////////
  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  varientType: string;

  // @Field(() => Category, { nullable: true })
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
