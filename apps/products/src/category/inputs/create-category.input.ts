import { InputType, Field } from '@nestjs/graphql';
import { CategoryAttributesInput } from './category-attributes.input';
import { MinLength } from 'class-validator';
/// import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name', nullable: false })
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  categoryName: string;

  // @Field(() => GraphQLJSON, { description: 'sub-category name' })
  // attributesJson: JSON;

  @Field(() => [CategoryAttributesInput], {
    description: 'attributes',
    nullable: false,
    defaultValue: [],
  })
  attributes: CategoryAttributesInput[];

  @Field(() => String, { description: 'description', nullable: false })
  description: string;

  @Field(() => String, { description: 'icon', nullable: false })
  icon: string;

  @Field(() => String, { description: 'status', nullable: false })
  status: string;

  @Field(() => String, { description: 'scope', nullable: true })
  scope: string;

  @Field(() => String, { description: 'immediateParentId', nullable: true })
  immediateParentId: string;

  // @Field(() => [String], { description: 'ancestors', nullable: true })
  // ancestors: CategoryAncestorInput[];

  // @Field(() => Int, { description: 'sortingOrder', nullable: true })
  // sortingOrder: number;
}
