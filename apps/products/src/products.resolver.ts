import { Resolver, Query } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
// import { CreateProductInput } from './dto/create-product.input';
// import { UpdateProductInput } from './dto/update-product.input';
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
// import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
// import { MessagePattern } from '@nestjs/microservices';
// import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  // @Mutation(() => Product)
  // async createProduct(
  //   @Args('createProductInput') createProductInput: CreateProductInput,
  // ) {
  //   return this.productsService.create(createProductInput);
  // }

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productsService.findAll();
  }

  // @Query(() => Product, { name: 'product' })
  // findOne(@Args('id', { type: () => Int }) _id: string) {
  //   return this.productsService.findOne(_id);
  // }

  // @Mutation(() => Product)
  // updateProduct(
  //   @Args('updateProductInput') updateProductInput: UpdateProductInput,
  // ) {
  //   return this.productsService.update(
  //     updateProductInput._id,
  //     updateProductInput,
  //   );
  // }

  // @Mutation(() => Product)
  // removeProduct(@Args('id') _id: string) {
  //   return this.productsService.remove(_id);
  // }
}
