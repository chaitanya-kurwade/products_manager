import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
// import { GraphQLUpload } from 'graphql-upload';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) _id: string) {
    return this.productsService.findOne(_id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(
      updateProductInput._id,
      updateProductInput,
    );
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) _id: string) {
    return this.productsService.remove(_id);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // @Mutation(()=>[String])
  // async uploadImage(@Args({ name: 'file', type: () => GraphQLUpload }) file: any): Promise <String[]> {
  //   const { createReadStream, filename, mimetype } = await file;
  //   const stream = createReadStream();
  //   const storedImage = await this.productsService.uploadImage({ stream, filename, mimetype });
  //   return storedImage;
  // }

  //   @Mutation('uploadFile')
  //   async uploadFile(@Args({ name: 'file', type: () => FileUpload }) file: FileUpload): Promise<any> {
  //     const { createReadStream, filename, mimetype } = await file;
  //     const stream = createReadStream();
  //     const path = `./uploads/${filename}`;
  //     return new Promise((resolve, reject) =>
  //       stream
  //         .pipe(createWriteStream(path))
  //         .on('finish', () => resolve({ filename, mimetype, encoding: 'UTF-8' }))
  //         .on('error', reject),
  //     );
  //   }
}
