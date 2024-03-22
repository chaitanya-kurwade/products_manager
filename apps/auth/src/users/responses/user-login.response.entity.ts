import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponse } from './user-response.entity';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: false })
  access_token: string;

  @Field({ nullable: false })
  refresh_token: string;

  @Field(() => UserResponse, { nullable: false })
  userResponse: UserResponse;
}
