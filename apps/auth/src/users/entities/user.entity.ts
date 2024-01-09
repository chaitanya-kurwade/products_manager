import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsStrongPassword } from 'class-validator';

@ObjectType()
@Schema()
export class User {
  @Field()
  _id: string;

  @Prop()
  @Field()
  firstName: string;

  @Prop()
  @Field()
  lastName: string;

  @IsEmail()
  @Prop()
  @Field()
  email: string;

  @IsStrongPassword()
  @Prop()
  @Field()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
