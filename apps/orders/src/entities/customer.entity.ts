import { Field, ObjectType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { PhoneNumber } from "./phone-number.entity";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class Customer {
    @Field(() => String, { nullable: true })
    @Prop()
    customerId: string;

    @Field(() => String, { nullable: true })
    @Prop()
    title: string;

    @Field(() => String, { nullable: true })
    @Prop()
    firstName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    lastName: string;

    @Field(() => PhoneNumber, { nullable: true })
    @Prop()
    phoneNumber: PhoneNumber;
    // { countryCode: string; phoneNumber: string };

    @IsEmail()
    @Field(() => String, { nullable: true })
    @Prop()
    email: string;
}