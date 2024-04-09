import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CredentialToLoginResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  type?: string;
}
