import { InputType, Int, Field } from '@nestjs/graphql';
import { Category } from '../category/entities/category.entity';
import { CreateCategoryInput } from '../category/dto/create-category.input';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  sku: string;

  @Field()
  price: number;

  @Field(()=>[String])
  productImages: string[];

  @Field()
  description: string;

  // @Field(() => Date)
  // timestamp: Date;

  @Field()
  varientType: string;

  @Field(() => CreateCategoryInput)
  category: CreateCategoryInput;
}
