import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class TrackingInfoInput {
  @Field(() => String, { nullable: true })
  shippedFrom?: string;

  @Field(() => String, { nullable: true })
  pickedBy?: string; // delivery guy id

  @Field(() => GraphQLISODateTime, { nullable: true })
  receivedAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  leftDate?: Date;

  @Field(() => Int, { nullable: true })
  sortingOrder?: number;
}
