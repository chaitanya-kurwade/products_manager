import { InputType, Field, Int } from '@nestjs/graphql';
// import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name' })
  categoryName: string;

  // @Field(() => GraphQLJSON, { description: 'sub-category name' })
  // attributesJson: JSON;

  @Field(() => String, { description: 'attributes', nullable: true })
  attributes: string;

  @Field(() => String, { description: 'description', nullable: true })
  descreption: string;

  @Field(() => String, { description: 'icon', nullable: true })
  icon: string;

  @Field(() => String, { description: 'status', nullable: true })
  status: string;

  @Field(() => String, { description: 'scope', nullable: true })
  scope: string;

  @Field(() => String, { description: 'immediateParent', nullable: true })
  immediateParent: string;

  @Field(() => String, { description: 'ancestors', nullable: true })
  ancestors: string;

  @Field(() => Int, { description: 'sortingOrder', nullable: true })
  sortingOrder: number;
}
