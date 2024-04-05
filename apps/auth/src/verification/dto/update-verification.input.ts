import { CreateVerificationInput } from './create-verification.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVerificationInput extends PartialType(
  CreateVerificationInput,
) {
  @Field(() => String)
  _id: string;
}
