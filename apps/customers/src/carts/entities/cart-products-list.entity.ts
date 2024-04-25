import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SubProduct } from "./sub-product.entity";

@ObjectType()
export class CartProductsList {
  @Field(() => [SubProduct], { description: 'product', nullable: true })
  subProduct: SubProduct[];

  @Field(() => Int, { description: 'totoalQuantity', nullable: true })
  totoalQuantity: number;

  @Field(() => Int, { description: 'totoalPrice', nullable: true })
  totoalPrice: number;
}