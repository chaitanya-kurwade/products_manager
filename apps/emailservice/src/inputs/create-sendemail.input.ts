import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendEmailInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  hexString?: string;

  @Field(() => String)
  token: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  code: string;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // createdAt: Date;

  @Field(() => Boolean, { defaultValue: true })
  isActiveToken: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isVerified: boolean;

  // @Field(() => GraphQLISODateTime, { nullable: false })
  // verifiedAt: Date;
}
