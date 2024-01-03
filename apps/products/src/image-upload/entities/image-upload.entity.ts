import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class ImageUpload {
  @Field({ description: 'Example field (placeholder)' })
  _id: string;

  @Prop()
  @Field()
  title: string;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  filename: string;

  @Prop()
  @Field()
  mimetype: string;

  @Prop()
  @Field()
  encoding: string;
}

export type ImageUploadDocument = ImageUpload & Document;
export const ImageUploadSchema = SchemaFactory.createForClass(ImageUpload);
