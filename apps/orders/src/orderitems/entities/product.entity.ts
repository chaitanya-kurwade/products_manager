import { Field, ObjectType } from "@nestjs/graphql";
import { Schema } from "@nestjs/mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => String, { nullable: true })
  productId?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}