import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  hashedRefreshToken: string;

  @Field({ nullable: true, defaultValue: false })
  isEmailVerified?: boolean;
}
