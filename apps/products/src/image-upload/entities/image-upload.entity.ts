import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Upload } from 'graphql-upload-ts';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class ImageUpload {
  @Field({ description: 'image id' })
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

  @Prop()
  @Field(()=>String)
  imageUri: string;
}

export type ImageUploadDocument = ImageUpload & Document;
export const ImageUploadSchema = SchemaFactory.createForClass(ImageUpload);
