import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMasterProductInput } from './inputs/create-masterproduct.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';
import {
  MasterProduct,
  MasterProductDocument,
} from './entities/master-product.entity';

@Injectable()
export class MasterProductService {
  constructor(
    @InjectModel(MasterProduct.name)
    private readonly masterProductModel: Model<MasterProductDocument>,
  ) {}
  async createMasterProduct(
    createMasterProductInput: CreateMasterProductInput,
  ) {
    const product = await this.masterProductModel.create(
      createMasterProductInput,
    );
    if (!product) {
      throw new BadRequestException('MasterProduct already exists');
    }
    return product;
  }

  async getAllMasterProducts() {
    const products = await this.masterProductModel.find();
    if (!products && products.length === 0) {
      throw new NotFoundException('MasterProducts not found');
    }
    return products;
  }

  async getOneMasterProductById(_id: string) {
    const product = await this.masterProductModel.findById(_id);
    if (!product) {
      throw new NotFoundException(
        'MasterProduct not available with Id: ' + _id,
      );
    }
    return product;
  }

  async updateMasterProductById(
    _id: string,
    updateMasterProductInput: UpdateMasterProductInput,
  ) {
    const product = await this.masterProductModel.findByIdAndUpdate(
      _id,
      updateMasterProductInput,
    );
    if (!product) {
      throw new BadRequestException('MasterProduct not updated, _id: ' + _id);
    }
    return product;
  }

  async deleteMasterProductById(_id: string) {
    const product = await this.masterProductModel.findByIdAndDelete(_id);
    if (!product) {
      throw new NotFoundException('MasterProduct not deleted, _id: ' + _id);
    }
    return product;
  }
}
