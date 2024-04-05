import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Verification {
  @Field(() => String, { description: 'Example field (placeholder)' })
  _id: string;

  // token, userId, createdAt, isVerified, isActiveToken, verifiedAt
  @Prop()
  @Field(() => String)
  token: string;

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

export type VerificationDocument = Verification & Document;
export const VerificationSchema = SchemaFactory.createForClass(Verification);
