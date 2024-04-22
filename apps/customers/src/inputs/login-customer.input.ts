import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginCustomerInput{
    @Field()
    userCredential: string;
  
    // @Field({ nullable: true })
    // username?: string;
  
    // @Field({ nullable: true })
    // // @IsPhoneNumber('IN')
    // phoneNumber?: string;
  
    @Field({ nullable: true })
    // @IsStrongPassword()
    passwordOrOtp?: string;
}