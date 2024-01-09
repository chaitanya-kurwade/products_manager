import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    // @Inject() private readonly imageUploadService: ImageUploadService
  ) {}

  async create(createProductInput: CreateProductInput) {
    const product = await this.productModel.create(createProductInput);
    if (!product) {
      throw new BadRequestException('Product already exists');
    }
    return product;
  }

  async findAll() {
    const products = await this.productModel.find();
    if (!products && products.length === 0) {
      throw new NotFoundException('products are not available');
    }
    return products;
  }

  async findOne(_id: string) {
    const product = await this.productModel.findById(_id);
    if (!product) {
      throw new NotFoundException('product are not available');
    }
    return product;
  }

  async update(_id: string, updateProductInput: UpdateProductInput) {
    const product = await this.productModel.findByIdAndUpdate(
      _id,
      updateProductInput,
    );
    if (!product) {
      throw new BadRequestException('product not updated, _id: ' + _id);
    }
    return product;
  }

  async remove(_id: string) {
    const product = await this.productModel.findByIdAndDelete(_id);
    if (!product) {
      throw new NotFoundException('product not deleted, _id: ' + _id);
    }
    return product;
  }

  async createProductWithImage(
    createProductInput: CreateProductInput,
    files: any[],
  ) {
    const images: any[] = [];
    for (const file of files) {
      const {
        file: { filename, mimetype, createReadStream },
      } = file;
      const stream = createReadStream();
      const path = `./uploads/${filename}`;
      await new Promise<void>((resolve, reject) =>
        stream
          .pipe(createWriteStream(path))
          .on('finish', () => {
            console.log('IMAGE_CREATED_IN_DIRECTORY_resolve', file), resolve();
          })
          .on('error', () => {
            console.log('IMAGE_NOT_CREATED_IN_DIRECTORY_reject'), reject;
          }),
      );
      images.push({
        filename,
        mimetype,
        encoding: 'UTF-8',
        title: filename,
        description: filename + ' is the file from image upload service',
        imageUri: join(__dirname, '..', '..', '..', 'uploads', `${filename}`),
      });
    }

    console.log(images);
    // const imagesToStore = await this.imageUploadService.processUploadedFiles(images);
    const product = await this.productModel.create(createProductInput);
    product.productImages = images;
    const productNew = this.productModel.create(product);
    return productNew;
  }
}
