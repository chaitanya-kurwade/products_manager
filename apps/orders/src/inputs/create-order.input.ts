import { InputType, Int, Field } from '@nestjs/graphql';
import { PAYMENT_TYPE } from '../enums/payment-method.enum';
import { PAYMENT_STATUS } from '../enums/payment-status.enum';

@InputType()
export class CreateOrderInput {
  @Field(() => String, { description: "Order's _id" })
  _id: string;

  @Field(() => Int)
  orderNumber: number;

  // @Field(() => String) // Customer
  // customer: {
  //   customerId: string;
  //   title: string;
  //   firstName: string;
  //   lastName: string;
  //   phoneNumber: { countryCode: string; phoneNumber: string };
  //   email: string;
  // };

    // @Field(() => ShippingAddress)
  // shippingAddress: {
  //   name: string;
  //   addressLine1: string;
  //   addressLine2: string;
  //   city: string;
  //   state: string;
  //   zip: string;
  //   country: string;
  // };

  // @Field(() => [OrderItem])
  // items: OrderItem[];

  @Field(() => Int)
  total: number;

  @Field(() => PAYMENT_STATUS, { nullable: true })
  status: PAYMENT_STATUS; // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Field(() => PAYMENT_TYPE, { nullable: true })
  paymentType: PAYMENT_TYPE; // 'CARD' | 'UPI' | 'NET BANKING' | 'COD';

  @Field(() => PAYMENT_STATUS, { nullable: true })
  paymentStatus: PAYMENT_STATUS; // 'Paid' | 'to be paid';

  // @Field(() => [Transaction])
  // transactions: Transaction[];

  // @Field(() => [Shipping])
  // shippings: Shipping[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
