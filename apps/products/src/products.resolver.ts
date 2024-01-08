import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ImageUploadService } from './image-upload/image-upload.service';
import { ImageUpload } from './image-upload/entities/image-upload.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { CreateImageUploadInput } from './image-upload/dto/create-image-upload.input';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload-ts';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imageUploadService: ImageUploadService
  ) {}

  @Mutation(() => Product)
  async createProduct( @Args('createProductInput') createProductInput: CreateProductInput ) {
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
  removeProduct(@Args('id') _id: string) {
    return this.productsService.remove(_id);
  }


  // @Mutation(() => [ImageUpload])
  // async uploadImages(
  //   @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Upload[],
  //   @Args({ name: 'createFileInDirectory', type: () => Boolean }) createFileInDirectory: boolean,
  // ): Promise<CreateImageUploadInput[]> {
  //   const uploads: any[] = [];
  //   // console.log('UPLOAD_IMAGE_CALLED', {
  //   //   files,
  //   //   createFileInDirectory,
  //   // });
  //   if (createFileInDirectory) {
  //     for (const file of files) {
  //       const {
  //         file: { filename, mimetype, encoding, createReadStream, imageUri },
  //         } = file;
  //       const stream = createReadStream();
  //       const path = `./uploads/${filename}`;
  //       await new Promise<void>((resolve, reject) =>
  //         stream
  //           .pipe(createWriteStream(path))
  //           .on('finish', () => {
  //             console.log('IMAGE_CREATED_IN_DIRECTORY_resolve', file), resolve();
  //           })
  //           .on('error', () => {
  //             console.log('IMAGE_NOT_CREATED_IN_DIRECTORY_reject'), reject;
  //           }),
  //       );
  //       uploads.push({ filename, mimetype, encoding: 'UTF-8', imageUri});
  //     }
  //   } else {
  //     for (const file of files) {
  //       const { createReadStream } = await file;
  //       const stream = createReadStream();
  //       await new Promise<void>((resolve, reject) =>
  //         stream
  //           .on('data', (data: any) => {
  //             console.log('DATA_FROM_STREAM', data);
  //           })
  //           .on('end', () => {
  //             console.log('END_OF_STREAM'), resolve();
  //           })
  //           .on('error', (error: any) => {
  //             console.log('IMAGE_UPLOAD_ERROR', error), reject();
  //           }),
  //       );
  //     }
  //   }
  //   // save to database
  //   const uploadedImages = await this.imageUploadService.processUploadedFiles(uploads);
  //   return uploadedImages;
  // }


  @Mutation(() => Product)
  async createProductWithImage( 
    @Args('createProductInput') createProductInput: CreateProductInput, 
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[]
  ) {
    return this.productsService.createProductWithImage(createProductInput, images);
  }
}
