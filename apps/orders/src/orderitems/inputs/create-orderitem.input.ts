import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductInput } from './product.input'; // Import the ProductInput if it exists
import { CURRENCY } from '../enums/currency.enum';
import { ORDER_STATUS } from '../enums/order-status.enum';

@InputType()
export class CreateOrderItemInput {
  @Field({ description: 'OrderItem _id' })
  _id: string;

  @Field(() => Int, { nullable: true })
  orderNumber?: number;

  @Field(() => ProductInput, { nullable: true })
  product?: ProductInput;

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field(() => Int, { nullable: true })
  unitPrice?: number;

  @Field(() => CURRENCY, { nullable: true })
  currency?: CURRENCY;

  @Field(() => String, { nullable: true })
  supplierId?: string;

  @Field(() => ORDER_STATUS, { nullable: true })
  status?: ORDER_STATUS;

  // @Field(() => GraphQLISODateTime, { nullable: true })
  // createdAt?: Date;

  // @Field(() => GraphQLISODateTime, { nullable: true })
  // updatedAt?: Date;
}
