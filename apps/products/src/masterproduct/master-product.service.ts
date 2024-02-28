import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMasterProductInput } from './inputs/create-master-product.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';
import {
  MasterProduct,
  MasterProductDocument,
} from './entities/master-product.entity';
import { PaginationInput } from 'common/library';
import { CategoryService } from '../category/category.service';
import { MasterProductList } from './responses/master-products-list.response.entity';
import { SubProductService } from '../subproduct/sub-product.service';

@Injectable()
export class MasterProductService {
  constructor(
    @InjectModel(MasterProduct.name)
    private readonly masterProductModel: Model<MasterProductDocument>,
    private readonly categoryService: CategoryService,
    private readonly subProductService: SubProductService,
  ) {}

  async createMasterProduct(
    createMasterProductInput: CreateMasterProductInput,
  ) {
    const category = await this.categoryService.getCategoryById(
      createMasterProductInput.categoryId,
    );
    const existingProductName = await this.masterProductModel.findOne({
      masterProductName: createMasterProductInput.masterProductName,
    });
    if (existingProductName) {
      throw new BadGatewayException(
        'Master product already exists with this name:' + existingProductName,
      );
    }
    const existingSku = await this.masterProductModel.findOne({
      sku: createMasterProductInput.sku,
    });
    if (existingSku) {
      throw new BadGatewayException(
        'Master product already exists with this name:' + existingSku,
      );
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
  ): Promise<MasterProductList> {
    const { page, limit, search, sortOrder } = paginationInput;

    let query = this.masterProductModel.find();
    let totalCountQuery = this.masterProductModel.find();

    if (search && searchFields.length > 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    // Apply sorting
    if (sortOrder) {
      query = query.sort(sortOrder);
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute the query
    const masterProducts = await query.exec();

    // Count total filtered documents
    const totalCount = await totalCountQuery.countDocuments();

    return { masterProducts, totalCount };
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

  async deleteMasterProductAndItsSubProducts(
    masterProductId: string,
  ): Promise<string> {
    await this.subProductService.deleteSubProductsByMasterProductId(
      masterProductId,
    );
    await this.deleteMasterProductById(masterProductId);
    console.log(masterProductId);
    return 'master product and its sub-products are deleted successfully';
  }

  async deleteCategoryAndMasterProduct(categoryId: string): Promise<string> {
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException(
        'category not found for this id: ' + categoryId,
      );
    }
    const masterProduct = await this.masterProductModel.find({
      'category._id': categoryId,
    });
    // console.log(masterProduct.map((product) => product._id));
    if (!masterProduct) {
      throw new NotFoundException('master product not found for this category');
    }
    await Promise.all(
      masterProduct.map(
        async (product) =>
          await this.deleteMasterProductAndItsSubProducts(product._id),
      ),
    );
    await this.categoryService.remove(categoryId);
    return 'category, master product and its sub-products are deleted successfully';
  }
}
