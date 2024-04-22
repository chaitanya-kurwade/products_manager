import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerResponse } from './customer.response.entity';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: false })
  access_token: string;

  @Field({ nullable: false })
  refresh_token: string;

  @Field(() => CustomerResponse, { nullable: false })
  userResponse: CustomerResponse;
}
