import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class SendEmail {
  @Field()
  _id: string;

  @Field()
  @Prop()
  email: string;

  @Prop()
  @Field({ nullable: true })
  hexString: string;

  // @Prop({ type: Date, required: false, default: new Date() })     GraphQLISODateTime
  // @Field(() => Date, { nullable: false })
  // validTillNextHour: Date;

  // token, userId, createdAt, isVerified, isActiveToken, verifiedAt
  @Prop()
  @Field(() => String)
  token: string;

  @Prop()
  @Field(() => String)
  code: string;

  @Prop()
  @Field(() => String)
  userId: string;

  @Prop()
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  @Prop()
  @Field(() => Boolean, { defaultValue: true })
  isActiveToken: boolean;

  @Prop()
  @Field(() => Boolean, { defaultValue: false })
  isVerified: boolean;

  @Prop()
  @Field(() => GraphQLISODateTime, { nullable: false })
  verifiedAt: Date;
}

export const SendEmailSchema = SchemaFactory.createForClass(SendEmail);
export type SendEmailDocument = SendEmail & Document;
