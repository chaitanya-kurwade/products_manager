import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginCredentialResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  code?: string;
}
