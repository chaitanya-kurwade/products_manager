import { CreateOrderItemInput } from './create-orderitem.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderItemInput extends PartialType(CreateOrderItemInput) {
  @Field(() => String)
  _id: string;
}
