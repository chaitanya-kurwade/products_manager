import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field()
  userCredential?: string;

  // @Field({ nullable: true })
  // username?: string;

  // @Field({ nullable: true })
  // // @IsPhoneNumber('IN')
  // phoneNumber?: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
