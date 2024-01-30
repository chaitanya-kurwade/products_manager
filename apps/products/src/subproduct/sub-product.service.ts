import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubProductInput } from './inputs/create-subproduct.input';
import { UpdateSubProductInput } from './inputs/update-subproduct.input';
import { InjectModel } from '@nestjs/mongoose';
import { SubPorductDocument, SubProduct } from './entities/sub-product.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubProductService {
  constructor(
    @InjectModel(SubProduct.name)
    private readonly subProductModel: Model<SubPorductDocument>,
  ) {}
  async createSubProduct(createSubProductInput: CreateSubProductInput) {
    const product = await this.subProductModel.create(createSubProductInput);
    if (!product) {
      throw new BadRequestException('SubProduct already exists');
    }
    return product;
  }

  async getAllSubProducts() {
    const products = await this.subProductModel.find();
    if (!products && products.length === 0) {
      throw new NotFoundException('SubProduct not found');
    }
    return products;
  }

  async getOneSubProductById(_id: string) {
    const product = await this.subProductModel.findById(_id);
    if (!product) {
      throw new NotFoundException('SubProduct not available with _id: ' + _id);
    }
    return product;
  }

  async updateSubProductById(
    _id: string,
    updateSubProductInput: UpdateSubProductInput,
  ) {
    const product = await this.subProductModel.findByIdAndUpdate(
      _id,
      updateSubProductInput,
    );
    if (!product) {
      throw new BadRequestException('SubProduct not updated, _id: ' + _id);
    }
    return product;
  }

  async deleteSubProductById(_id: string) {
    const product = await this.subProductModel.findByIdAndDelete(_id);
    if (!product) {
      throw new NotFoundException('SubProduct not deleted, _id: ' + _id);
    }
    return product;
  }
}
