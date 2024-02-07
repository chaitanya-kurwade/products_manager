import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterProductImage {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  altText: string;

  @Field({ nullable: true })
  order: string;

  @Field({ nullable: true })
  img: string;
}
