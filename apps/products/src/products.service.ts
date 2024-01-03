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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async uploadImage({ stream, filename, mimetype }): Promise<{ filename: string; url: string; mimetype: string }> {
    const storedFilename = `${Date.now()}-${filename}`;
    const storedPath = `./uploads/${storedFilename}`;

    return new Promise((resolve, reject) =>
      stream
        .pipe(createWriteStream(storedPath))
        .on('finish', () =>
          resolve({
            filename: storedFilename,
            url: `http://localhost:3001/uploads/${storedFilename}`, // adjust accordingly
            mimetype,
          }),
        )
        .on('error', reject),
    );
  }

  // processUploadedFiles(files: any[]): void {
  //   // You can implement logic to save the file details to a database or perform other actions.
  //   console.log('Processing uploaded files:', files);
  // }

  // @Mutation('uploadFiles')
  // async uploadFiles(@Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[]): Promise<any[]> {
  //   const uploads: any[] = [];

  //   for (const file of files) {
  //     const { createReadStream, filename, mimetype } = await file;
  //     const stream = createReadStream();
  //     const path = `./uploads/${filename}`;

  //     await new Promise((resolve, reject) =>
  //       stream
  //         .pipe(createWriteStream(path))
  //         .on('finish', () => resolve())
  //         .on('error', reject),
  //     );

  //     uploads.push({ filename, mimetype, encoding: 'UTF-8' });
  //   }

  //   // You can now save 'uploads' to a database or perform other actions as needed.
  //   this.uploadService.processUploadedFiles(uploads);

  //   return uploads;
  // }


}
