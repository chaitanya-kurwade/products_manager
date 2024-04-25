import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PhoneNumberInput {
    @Field()
    countryCode: string; 
    
    @Field()
    phoneNumber: string
}