import { InputType, Field } from '@nestjs/graphql';
import { CreateCategoryInput } from '../category/dto/create-category.input';
import { CreateImageUploadInput } from '../image-upload/dto/create-image-upload.input';
import { ImageUpload } from '../image-upload/entities/image-upload.entity';

@InputType()
export class CreateProductInput {
  // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Upload[],
  // @Args({ name: 'createFileInDirectory', type: () => Boolean }) createFileInDirectory: boolean,

  @Field()
  name: string;

  @Field()
  sku: string;

  @Field()
  price: number;

  @Field(() => [CreateImageUploadInput])
  productImages: ImageUpload[];

  @Field()
  description: string;

  // @Field(() => Date)
  // timestamp: Date;

  @Field()
  varientType: string;

  @Field(() => CreateCategoryInput)
  category: CreateCategoryInput;
}
