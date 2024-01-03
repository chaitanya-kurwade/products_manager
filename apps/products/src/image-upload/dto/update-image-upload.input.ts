import { CreateImageUploadInput } from './create-image-upload.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateImageUploadInput extends PartialType(CreateImageUploadInput) {
  @Field()
  _id: string;
}
