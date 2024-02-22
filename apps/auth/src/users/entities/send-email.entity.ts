import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

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
  @Field(() => Date, { nullable: false })
  validTillNextHour: Date;
}
