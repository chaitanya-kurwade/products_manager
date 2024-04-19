import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class TrackingInfo {
    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    shippedFrom?: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    pickedBy?: string; // delivery guy id

    @Field(() => GraphQLISODateTime, { nullable: true })
    @Prop()
    receivedAt?: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @Prop()
    leftDate?: Date;

    @Field(() => Int, { nullable: true })
    @Prop()
    sortingOrder?: number;
}