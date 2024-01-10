import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name' })
  categoryName: string;

  @Field(() => GraphQLJSON, { description: 'sub-category name' })
  attributesJson: JSON;
}
