import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsStrongPassword } from 'class-validator';
import { ROLES } from '../enums/role.enum';

@InputType()
export class UpdateUserInput {
  @Field()
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  username?: string;

  @IsPhoneNumber('IN')
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsEmail()
  @Field()
  email: string;

  // @IsStrongPassword()
  // @Field()
  // password: string;

  // @Field({ nullable: true, defaultValue: false })
  // isEmailVerified?: boolean;

  @Field(() => String, { nullable: true, defaultValue: ROLES.USER })
  role?: ROLES;

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
}
