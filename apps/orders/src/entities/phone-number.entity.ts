import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class PhoneNumber {
    @Prop()
    @Field()
    countryCode: string;

    @Prop()
    @Field()
    phoneNumber: string
}