import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsStrongPassword } from 'class-validator';

@ObjectType()
export class User {
  @Field()
  _id: string;

  @Prop()
  @Field()
  firstName: string;

  @IsEmail()
  @Prop()
  @Field()
  email: string;
}
