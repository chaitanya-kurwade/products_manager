import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: false })
  access_token: string;

  @Field({ nullable: false })
  refresh_token: string;
}
