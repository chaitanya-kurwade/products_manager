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
}
