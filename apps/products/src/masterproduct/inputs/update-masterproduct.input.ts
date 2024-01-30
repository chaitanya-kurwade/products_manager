import { CreateMasterProductInput } from './create-masterproduct.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMasterProductInput extends PartialType(
  CreateMasterProductInput,
) {
  @Field(() => Int)
  id: number;
}
