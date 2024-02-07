import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterProductImage {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  altText: string;

  @Field({ nullable: false })
  order: string;

  @Field({ nullable: false })
  img: string;
}
