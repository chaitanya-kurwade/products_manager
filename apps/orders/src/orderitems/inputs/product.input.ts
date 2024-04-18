import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProductInput {
  @Field({ nullable: true, description: 'Product ID' })
  productId?: string;

  @Field({ nullable: true, description: 'Product name' })
  name?: string;

  @Field({ nullable: true, description: 'Product image URL' })
  imageUrl?: string;
}
