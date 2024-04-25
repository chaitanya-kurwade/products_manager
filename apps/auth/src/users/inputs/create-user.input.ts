import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { ROLES } from '../../../../../libs/library/src/enums/role.enum';

@InputType()
export class CreateUserInput {
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

  // @IsStrongPassword()
  // @Field()
  // password: string;

  // @Field({ nullable: true, defaultValue: false })
  // isEmailVerified?: boolean;

  @Field(() => ROLES, { nullable: true, defaultValue: ROLES.USER })
  role?: ROLES;
}
