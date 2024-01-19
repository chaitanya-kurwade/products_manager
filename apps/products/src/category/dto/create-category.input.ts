import { InputType, Field } from '@nestjs/graphql';
// import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name' })
  categoryName: string;

  // @Field(() => GraphQLJSON, { description: 'sub-category name' })
  // attributesJson: JSON;

  @Field(() => String, { description: 'attributes' })
  attributes: string;

  @Field(() => String, { description: 'description' })
  descreption: string;

  @Field(() => String, { description: 'icon' })
  icon: string;

  @Field(() => String, { description: 'status' })
  status: string;

  @Field(() => String, { description: 'scope' })
  scope: string;

  @Field(() => String, { description: 'scope' })
  immediateParent: string;

  @Field(() => String, { description: 'ancestors' })
  ancestors: string;

  @Field({ description: 'sortingOrder' })
  sortingOrder: number;
}
