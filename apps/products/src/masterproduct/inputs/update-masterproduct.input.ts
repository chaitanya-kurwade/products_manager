import { CreateMasterProductInput } from './create-master-product.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMasterProductInput extends PartialType(
  CreateMasterProductInput,
) {
  @Field()
  _id: string;
}
