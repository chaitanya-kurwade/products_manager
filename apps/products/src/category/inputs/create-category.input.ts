import { InputType, Field, Int } from '@nestjs/graphql';
import { CategoryAttributesInput } from './category-attributes.input';
import { MinLength } from 'class-validator';
// import GraphQLJSON from 'graphql-type-json';

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

  // @MinLength(2, {
  //   message: 'Category description must be at least 2 characters long',
  // })
  @Field(() => String, { description: 'description', nullable: false })
  description: string;

  @Field(() => String, { description: 'icon', nullable: false })
  // @MinLength(2, { message: 'Category icon must be at least 2 characters long' })
  icon: string;

  @Field(() => String, { description: 'status', nullable: false })
  // @MinLength(2, {
  //   message: 'Category status must be at least 2 characters long',
  // })
  status: string;

  @Field(() => String, { description: 'scope', nullable: true })
  // @MinLength(2, {
  //   message: 'Category scope must be at least 2 characters long',
  // })
  scope: string;

  @Field(() => String, { description: 'immediateParentId', nullable: true })
  immediateParentId: string;

  // @MinLength(2, {
  //   message: 'Category ancestors must be at least 2 characters long',
  // })
  @Field(() => String, { description: 'ancestors', nullable: true })
  ancestors: string;

  @Field(() => Int, { description: 'sortingOrder', nullable: true })
  sortingOrder: number;
}
