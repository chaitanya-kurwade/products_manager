import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResponse {
  @Field()
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  role?: string;
}
