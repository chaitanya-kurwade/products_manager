import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  _id: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field()
  lastName: string;

  @Field()
  hashedRefreshToken: string;

  @Field({ nullable: true, defaultValue: false })
  isEmailVerified?: boolean;

  @Field(() => String, { nullable: true })
  role?: string;

}
