import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => String, { nullable: true })
  productId?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}