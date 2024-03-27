import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryAncestor {
  @Field(() => String, { description: 'ancestorId', nullable: true })
  id: string;

  @Field(() => String, { description: 'ancestorName', nullable: true })
  categoryName?: string;

  @Field(() => Int, { description: 'sortingOrder', nullable: true })
  sortingOrder?: number;
}
