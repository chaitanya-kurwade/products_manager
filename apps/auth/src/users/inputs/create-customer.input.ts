import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  username?: string;

  // @IsPhoneNumber('IN')
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsEmail()
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  // @Field({ nullable: true, defaultValue: false })
  // isEmailVerified?: boolean;

  // @Field(() => ROLES, { nullable: true, defaultValue: ROLES.USER })
  // role?: ROLES;
}
