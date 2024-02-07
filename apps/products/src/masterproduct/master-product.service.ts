import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMasterProductInput } from './inputs/create-masterproduct.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';
import {
  MasterProduct,
  MasterProductDocument,
} from './entities/master-product.entity';
import { PaginationInput } from 'common/library';
import { CategoryService } from '../category/category.service';

@Injectable()
export class MasterProductService {
  constructor(
    @InjectModel(MasterProduct.name)
    private readonly masterProductModel: Model<MasterProductDocument>,
    private readonly categoryService: CategoryService,
  ) {}

  async createMasterProduct(
    createMasterProductInput: CreateMasterProductInput,
  ) {
    const category = await this.categoryService.getCategoryById(
      createMasterProductInput.categoryId,
    );
    const existingProduct = await this.masterProductModel.findOne({
      masterProductName: createMasterProductInput.masterProductName,
    });
    if (existingProduct) {
      throw new BadGatewayException('Master product already exists');
    }
    try {
      const product = await this.masterProductModel.create({
        ...createMasterProductInput,
        category,
      });
      return product;
    } catch (error) {
      throw new BadRequestException('MasterProduct not created');
    }
  }

  async getAllMasterProducts(
    paginationInput: PaginationInput,
    searchFields?: string[],
  ) {
    const { page, limit, search, sortField, sortOrder } = paginationInput;
    let query = this.masterProductModel.find();
    if (searchFields == null || !searchFields.length) {
      // console.log(query);
      if (search) {
        query = query.where('masterProductName').regex(new RegExp(search, 'i'));
      }
      if (!page && !limit && !sortField && !sortOrder) {
        return query.sort({ createdAt: -1 }).exec();
      }
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        throw new BadRequestException(
          'Invalid sortOrder. It must be either ASC or DESC.',
        );
      }
      if (sortField && sortOrder) {
        console.log(sortOrder, 'single', sortField);
        const sortOptions: { [key: string]: SortOrder } = {};
        sortOptions[sortField] = sortOrder.toLowerCase() as SortOrder;
        query = query.sort(sortOptions);
      }
      const skip = (page - 1) * limit;
      const products = await query.skip(skip).limit(limit).exec();
      if (!products && products.length === 0) {
        throw new NotFoundException('MasterProducts not found');
      }
      return products;
    } else {
      query = this.buildQuery(search, searchFields);
      // console.log(query);
      if (!page && !limit && !sortField && !sortOrder) {
        return query.sort({ createdAt: -1 }).exec();
      }
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        throw new BadRequestException(
          'Invalid sortOrder. It must be either ASC or DESC.',
        );
      }
      if (sortField && sortOrder) {
        console.log(sortOrder, 'all', sortField);
        const sortOptions: { [key: string]: SortOrder } = {};
        sortOptions[sortField] = sortOrder.toLowerCase() as SortOrder;
        query = query.sort(sortOptions);
      }
      const skip = (page - 1) * limit;
      const products = await query.skip(skip).limit(limit).exec();
      if (!products && products.length == 0) {
        throw new NotFoundException('MasterProducts not found');
      }
      return products;
    }
  }

  private buildQuery(search: string, searchFields?: string[]): any {
    let query = this.masterProductModel.find();
    if (search) {
      const orConditions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search, 'i') },
      }));
      query = query.or(orConditions);
    }
    return query;
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
