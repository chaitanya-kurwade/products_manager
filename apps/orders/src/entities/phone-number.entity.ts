import { Field, ObjectType } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class PhoneNumber {

    @Prop()
    @Field()
    countryCode: string;

    @Prop()
    @Field()
    phoneNumber: string
}