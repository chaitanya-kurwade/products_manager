import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterProductAttributes {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  attributeName: string;

  @Field({ nullable: true })
  value: string;
}
