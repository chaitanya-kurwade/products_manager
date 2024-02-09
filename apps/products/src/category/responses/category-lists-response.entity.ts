import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@ObjectType()
export class CategoryList {
  @Field(() => [Category])
  categories: Category[];

  @Field(() => Int)
  totalCount: number;
}
