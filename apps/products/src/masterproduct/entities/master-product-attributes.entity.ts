import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterProductAttributes {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  attributeName: string;

  @Field({ nullable: false })
  value: string;
}
