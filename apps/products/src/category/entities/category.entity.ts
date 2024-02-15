import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';
import { CategoryAttributes } from './category-attributes.entity';
import { MinLength } from 'class-validator';
import { CategoryAncestor } from './category-ancestor.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Category {
  @Field(() => String, { description: 'category _id' })
  _id: string;

  @Prop()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @Field(() => String, { description: 'category name', nullable: false })
  categoryName: string;

  @Prop()
  @Field(() => [CategoryAttributes], {
    description: 'attributes',
    nullable: false,
    defaultValue: [],
  })
  attributes: CategoryAttributes[];

  @Prop()
  // @MinLength(2, {
  //   message: 'Category description must be at least 2 characters long',
  // })
  @Field(() => String, { description: 'description', nullable: false })
  description: string;

  @Prop()
  // @Field(() => String, { description: 'icon', nullable: false })
  @MinLength(2, { message: 'Category icon must be at least 2 characters long' })
  icon: string;

  @Prop()
  @Field(() => String, { description: 'status', nullable: false })
  // @MinLength(2, {
  //   message: 'Category status must be at least 2 characters long',
  // })
  status: string;

  @Prop()
  @Field(() => String, { description: 'scope', nullable: true })
  // @MinLength(2, {
  //   message: 'Category scope must be at least 2 characters long',
  // })
  scope: string;

  @Prop()
  @Field(() => String, { description: 'immediateParentId', nullable: true })
  immediateParentId: string;

  // @MinLength(2, {
  //   message: 'Category ancestors must be at least 2 characters long',
  // })
  @Prop()
  @Field(() => [CategoryAncestor], { description: 'ancestors', nullable: true })
  ancestors: CategoryAncestor[];

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;
