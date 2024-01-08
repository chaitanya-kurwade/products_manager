import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateImageUploadInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;

  @Field(()=>String)
  imageUri: string;
}
