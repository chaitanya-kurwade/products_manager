import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Category {
  @Field(() => String, { description: 'category Id' })
  _id: string;

  @Prop()
  @Field(() => String, { description: 'category name', nullable: true })
  categoryName: string;

  // @Prop({ type: JSON })
  // @Field(() => GraphQLJSON, { description: 'sub-category name' })
  // attributesJson: JSON;

  @Prop()
  @Field(() => String, { description: 'attributes', nullable: true })
  attributes: string;

  @Prop()
  @Field(() => String, { description: 'description', nullable: true })
  descreption: string;

  @Prop()
  @Field(() => String, { description: 'icon', nullable: true })
  icon: string;

  @Prop()
  @Field(() => String, { description: 'status', nullable: true })
  status: string;

  @Prop()
  @Field(() => String, { description: 'scope', nullable: true })
  scope: string;

  @Prop()
  @Field(() => String, { description: 'scope', nullable: true })
  immediateParent: string;

  @Prop()
  @Field(() => String, { description: 'ancestors', nullable: true })
  ancestors: string;

  @Prop()
  @Field({ description: 'sortingOrder', nullable: true })
  sortingOrder: number;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop({ type: Date, required: true, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;

/* 
_id: ObjectId,
  name: String,
  description: String,
  attributes: string, # { language: String, cover: String} for books, { color: String, size: String } for T-Shirts
  icon: String,
  status: String, # PUBLISHED, ARCHIVED, DRAFT
  scope: [String], # ["Suppliers", "Users", "Admin"] # Why we need scope? Should we think more on scope.
  immediateParent: ObjectId | null,
  ancestors: [JSON], # [{ _id: String, name: '' }]
  sortingOrder: number,
  updatedAt: Date,
  createdAt: Date,
*/
