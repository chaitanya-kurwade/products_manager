import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';
import { ROLES } from '../../../../../libs/library/src/enums/role.enum';

@ObjectType()
export class UserResponse {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field({ defaultValue: false })
  isEmailVerified: boolean;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  username?: string;

  @IsPhoneNumber('IN')
  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true, defaultValue: ROLES.USER })
  role?: string;

  @Field({ nullable: true })
  addLineOne?: string;

  @Field({ nullable: true })
  addLineTwo?: string;

  @Field({ nullable: true })
  pin?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  landMark?: string;

  //image
  @Field({ nullable: true })
  avatarUrl?: string;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  updatedAt: Date;
}
