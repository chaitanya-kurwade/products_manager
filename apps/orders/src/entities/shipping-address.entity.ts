import { Field, ObjectType } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class ShippingAddress {
    @Prop()
    @Field(() => String, { nullable: true })
    name: string;

    @Prop()
    @Field(() => String, { nullable: true })
    addressLine1: string;

    @Prop()
    @Field(() => String, { nullable: true })
    addressLine2: string;

    @Prop()
    @Field(() => String, { nullable: true })
    city: string;

    @Prop()
    @Field(() => String, { nullable: true })
    state: string;

    @Prop()
    @Field(() => String, { nullable: true })
    zip: string;

    @Prop()
    @Field(() => String, { nullable: true })
    country: string;
}