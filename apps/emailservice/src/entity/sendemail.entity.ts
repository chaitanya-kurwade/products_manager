import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class SendEmail {
  @Field()
  @Prop()
  email: string;

  @Prop()
  @Field()
  hexString: string;

  // @Prop({ type: Date, required: false, default: new Date() })     GraphQLISODateTime
  // @Field(() => Date, { nullable: false })
  // validTillNextHour: Date;
}

export const SendEmailSchema = SchemaFactory.createForClass(SendEmail);
export type SendEmailDocument = SendEmail & Document;
