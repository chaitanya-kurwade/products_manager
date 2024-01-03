import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLObjectType } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Category {

  @Field(() => String, { description: 'category Id' })
  _id: string;

  @Prop()
  @Field(() => String, { description: 'category name' })
  categoryName: string;

  @Prop({type:JSON})
  @Field(() => GraphQLJSON, { description: 'sub-category name' })
  attributes: JSON;
  
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;