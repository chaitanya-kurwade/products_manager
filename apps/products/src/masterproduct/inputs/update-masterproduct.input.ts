import { CreateMasterProductInput } from './create-masterproduct.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMasterProductInput extends PartialType(
  CreateMasterProductInput,
) {
  @Field()
  _id: string;
}
