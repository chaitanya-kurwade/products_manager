import { InputType, Field, PartialType } from '@nestjs/graphql';
import { SendEmailInput } from './create-sendemail.input';

@InputType()
export class UpdateSendEmailInput extends PartialType(SendEmailInput) {
  @Field(() => String)
  _id: string;
}
