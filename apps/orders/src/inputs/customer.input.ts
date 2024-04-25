import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { PhoneNumberInput } from "./phone-number.input";

@InputType()
export class CustomerInput {
    @Field(() => String, { nullable: true })
    customerId: string;

    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => PhoneNumberInput, { nullable: true })
    phoneNumber: PhoneNumberInput;
    // { countryCode: string; phoneNumber: string };

    @IsEmail()
    @Field(() => String, { nullable: true })
    email: string;
}