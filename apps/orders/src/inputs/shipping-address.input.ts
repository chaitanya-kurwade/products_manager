import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ShippingAddressInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String, { nullable: true })
    addressLine1: string;

    @Field(() => String, { nullable: true })
    addressLine2: string;

    @Field(() => String, { nullable: true })
    city: string;

    @Field(() => String, { nullable: true })
    state: string;

    @Field(() => String, { nullable: true })
    zip: string;

    @Field(() => String, { nullable: true })
    country: string;
}