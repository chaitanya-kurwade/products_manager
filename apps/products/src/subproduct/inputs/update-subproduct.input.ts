import { CreateSubProductInput } from './create-subproduct.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubProductInput extends PartialType(CreateSubProductInput) {
  @Field()
  _id: string;
}
