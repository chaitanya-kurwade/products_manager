import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryAttributes {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  attributeName: string;

  @Field({ nullable: true })
  value: string;
}
