import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MasterProductImageInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  altText: string;

  @Field({ nullable: false })
  order: number;

  @Field({ nullable: false })
  img: string;
}
