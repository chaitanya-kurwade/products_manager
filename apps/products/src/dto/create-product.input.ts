import { InputType, Field } from '@nestjs/graphql';
import { CreateCategoryInput } from '../category/dto/create-category.input';

@InputType()
export class CreateProductInput {
  // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Upload[],
  // @Args({ name: 'createFileInDirectory', type: () => Boolean }) createFileInDirectory: boolean,

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  sku: string;

  @Field({ nullable: true })
  price: number;

  // @Field(() => [CreateImageUploadInput])
  // productImages: ImageUpload[];

  @Field({ nullable: true })
  description: string;

  // @Field(() => Date)
  // timestamp: Date;

  @Field({ nullable: true })
  varientType: string;

  @Field(() => CreateCategoryInput, { nullable: true })
  category: CreateCategoryInput;
}
