import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MasterProductImageInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  altText: string;

  @Field({ nullable: true })
  order: string;

  @Field({ nullable: true })
  img: string;
}
