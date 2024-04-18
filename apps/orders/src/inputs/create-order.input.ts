import { InputType, Int, Field } from '@nestjs/graphql';
import { PAYMENT_TYPE } from '../enums/payment-method.enum';

@InputType()
export class CreateOrderInput {
  @Field(() => String, { description: "Order's _id" })
  _id: string;

  @Field(() => Int)
  orderNumber: number;

  @Field(() => String)
  customer: {
    customerId: string;
    title: string;
    firstName: string;
    lastName: string;
    phoneNumber: { countryCode: string; phoneNumber: string };
    email: string;
  };

  // @Field(() => [OrderItem])
  // items: OrderItem[];

  @Field(() => Int)
  total: number;

  @Field(() => String)
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Field(() => PAYMENT_TYPE)
  paymentType: 'CARD' | 'UPI' | 'NET BANKING' | 'COD';

  @Field(() => String)
  paymentStatus: 'Paid' | 'to be paid';

  // @Field(() => [Transaction])
  // transactions: Transaction[];

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

  // @Field(() => [Shipping])
  // shippings: Shipping[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
