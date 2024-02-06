import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsStrongPassword } from 'class-validator';

@ObjectType()
@Schema({ timestamps: true })
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

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: true })
  hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
