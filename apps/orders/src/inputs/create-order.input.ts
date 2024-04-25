import { InputType, Int, Field } from '@nestjs/graphql';
import { PAYMENT_TYPE } from '../enums/payment-method.enum';
import { PAYMENT_STATUS } from '../enums/payment-status.enum';
import { ShippingAddressInput } from './shipping-address.input';
import { CustomerInput } from './customer.input';

@InputType()
export class CreateOrderInput {

  @Field(() => Int)
  orderNumber: number;

  @Field(() => CustomerInput) // CustomerInput
  customer: CustomerInput;

  @Field(() => ShippingAddressInput) // ShippingAddressInput
  shippingAddress: ShippingAddressInput;

  // @Field(() => [CreateOrderItemInput])
  // items: CreateOrderItemInput[];

  @Field(() => Int)
  total: number;

  @Field(() => PAYMENT_STATUS, { nullable: true })
  status: PAYMENT_STATUS; // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Field(() => PAYMENT_TYPE, { nullable: true })
  paymentType: PAYMENT_TYPE; // 'CARD' | 'UPI' | 'NET BANKING' | 'COD';

  @Field(() => PAYMENT_STATUS, { nullable: true })
  paymentStatus: PAYMENT_STATUS; // 'Paid' | 'to be paid';

  // @Field(() => [Transaction], { nullable: true })
  // transactions: Transaction[];

  // @Field(() => [Shipping], { nullable: true })
  // shippings: Shipping[];

  // @Field(() => Date, { nullable: true })
  // createdAt: Date;

  // @Field(() => Date, { nullable: true })
  // updatedAt: Date;
}
