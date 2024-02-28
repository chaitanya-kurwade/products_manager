import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubProductInput } from './inputs/create-subproduct.input';
import { UpdateSubProductInput } from './inputs/update-subproduct.input';
import { InjectModel } from '@nestjs/mongoose';
import { SubPorductDocument, SubProduct } from './entities/sub-product.entity';
import { Model } from 'mongoose';
import { PaginationInput } from 'common/library';
import { SubProductList } from './responses/sub-products-list.response.entity';

@Injectable()
export class SubProductService {
  constructor(
    @InjectModel(SubProduct.name)
    private readonly subProductModel: Model<SubPorductDocument>,
  ) {}
  async createSubProduct(createSubProductInput: CreateSubProductInput) {
    const existingSku = await this.subProductModel.findOne({
      sku: createSubProductInput.sku,
    });
    if (existingSku) {
      throw new BadGatewayException(
        'Master product already exists with this name:' + existingSku,
      );
    }
    const product = await this.subProductModel.create(createSubProductInput);
    if (!product) {
      throw new BadRequestException('SubProduct already exists');
    }
    return product;
  }

  async getAllSubProducts(
    paginationInput: PaginationInput,
    searchFields?: string[],
  ): Promise<SubProductList> {
    const { page, limit, search, sortOrder } = paginationInput;

    let query = this.subProductModel.find();
    let totalCountQuery = this.subProductModel.find();

    if (search && searchFields.length > 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    let sortOptions = {};
    if (sortOrder) {
      if (sortOrder.toUpperCase() === 'ASC') {
        sortOptions = { createdAt: 1 };
      } else if (sortOrder.toUpperCase() === 'DESC') {
        sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    query = query.sort(sortOptions);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const subProducts = await query.exec();

    const totalCount = await totalCountQuery.countDocuments();

    return { subProducts, totalCount };
  }

  async getOneSubProductById(_id: string) {
    const product = await this.subProductModel.findById(_id);
    if (!product) {
      throw new NotFoundException('SubProduct not available with _id: ' + _id);
    }
    return product;
  }

  async getSubProductsByMasterProductId(masterProductId: string) {
    const subProductsList = await this.subProductModel
      .find({ masterProductId })
      .exec();
    console.log(subProductsList);
    if (!subProductsList || subProductsList.length === 0) {
      throw new NotFoundException(
        'SubProduct not available with ' + masterProductId + ' masterProductId',
      );
    }
    return subProductsList;
  }

  async deleteSubProductsByMasterProductId(
    masterProductId: string,
  ): Promise<string> {
    const subCats = await this.subProductModel.find({ masterProductId });
    console.log('subCats');
    await Promise.all(
      subCats.map(
        async (subProduct) =>
          await this.subProductModel.findByIdAndDelete(subProduct._id),
      ),
    );
    return 'subproducts deleted';
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
