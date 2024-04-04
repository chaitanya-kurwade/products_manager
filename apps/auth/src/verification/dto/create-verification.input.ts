import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateVerificationInput {
  @Field(() => String)
  token: string;

  @Field(() => String)
  userId: string;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // createdAt: Date;

  @Field(() => Boolean, { defaultValue: true })
  isActiveToken: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isVerified: boolean;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // verifiedAt: Date;
}
