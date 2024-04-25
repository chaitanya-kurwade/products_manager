import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsStrongPassword } from 'class-validator';
import { ROLES } from '../../../../../libs/library/src/enums/role.enum';

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

  @Prop()
  @Field({ nullable: true })
  username?: string;

  @IsPhoneNumber('IN')
  @Prop()
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsEmail()
  @Prop()
  @Field()
  email: string;

  @Field({ nullable: true, defaultValue: false })
  @Prop()
  isEmailVerified: boolean;

  @IsStrongPassword()
  @Prop()
  @Field()
  password: string;

  @Prop()
  @Field({ nullable: true })
  addLineOne?: string;

  @Prop()
  @Field({ nullable: true })
  addLineTwo?: string;

  @Prop()
  @Field({ nullable: true })
  pin?: string;

  @Prop()
  @Field({ nullable: true })
  state?: string;

  @Prop()
  @Field({ nullable: true })
  city?: string;

  @Prop()
  @Field({ nullable: true })
  country?: string;

  @Prop()
  @Field({ nullable: true })
  landMark?: string;

  //image
  @Prop()
  @Field({ nullable: true })
  avatarUrl?: string;

  // @Prop({ type: String, enum: ROLES })
  @Prop({ enum: ROLES, default: ROLES.USER, type: String })
  role?: ROLES;

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: false })
  hashedRefreshToken: string;

  @Prop()
  @Field({ nullable: true })
  emailOtp: number;

  @Prop()
  @Field(() => GraphQLISODateTime, { nullable: true })
  emailOtpExpiryTime: Date;

  @Prop()
  @Field({ nullable: true })
  phoneOtp: number;

  @Prop()
  @Field(() => GraphQLISODateTime, { nullable: true })
  phoneOtpExpiryTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
