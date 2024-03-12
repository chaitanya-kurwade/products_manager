import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsStrongPassword } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  @IsPhoneNumber('IN')
  phoneNumber?: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
