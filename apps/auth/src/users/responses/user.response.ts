import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  hashedRefreshToken: string;
}
