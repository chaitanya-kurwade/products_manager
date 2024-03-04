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
        'sku already exists with this name:' + existingSku,
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
    masterProductIds?: string[],
  ): Promise<SubProductList> {
    const { page, limit, search, sortOrder } = paginationInput;

    let query = this.subProductModel.find({ status: 'PUBLISHED' });
    let totalCountQuery = this.subProductModel.find({ status: 'PUBLISHED' });
    if (search && searchFields && searchFields.length > 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    if (masterProductIds && masterProductIds.length !== 0) {
      query = query.where('masterProductId').in(masterProductIds);
      totalCountQuery = totalCountQuery
        .where('masterProductId')
        .in(masterProductIds);
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

    const minMaxPricePipeline = [
      {
        $group: {
          _id: null,
          minPrice: { $min: '$prices' },
          maxPrice: { $max: '$prices' },
        },
      },
    ];

    const [subProducts, minMaxPrice] = await Promise.all([
      query.exec(),
      this.subProductModel.aggregate(minMaxPricePipeline).exec(),
    ]);
    // const subProducts = await query.exec();
    const totalCount = await totalCountQuery.countDocuments();

    return {
      subProducts,
      totalCount,
      minPrice: minMaxPrice.length !== 0 ? minMaxPrice[0].minPrice : undefined,
      maxPrice: minMaxPrice.length !== 0 ? minMaxPrice[0].maxPrice : undefined,
    };
  }

  async getOneSubProductById(_id: string) {
    const product = await this.subProductModel.findById({
      _id,
    });
    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException(
        'SubProduct not available with _id: ' +
          _id +
          ', or it is not published',
      );
    }
    return product;
  }

  async getSubProductsByMasterProductId(masterProductId: string) {
    const subProducts = await this.subProductModel
      .find({ masterProductId, status: 'PUBLISHED' })
      .exec();
    console.log(subProducts);
    if (!subProducts || subProducts.length === 0) {
      throw new NotFoundException(
        'SubProduct not available with ' + masterProductId + ' masterProductId',
      );
    }
    return subProducts;
  }

  async getMinMaxPrices() {
    const minPriceAggregate = await this.subProductModel
      .aggregate([{ $group: { _id: null, minPrice: { $min: '$prices' } } }])
      .exec();

    const maxPriceAggregate = await this.subProductModel
      .aggregate([{ $group: { _id: null, maxPrice: { $max: '$prices' } } }])
      .exec();

    const minPrice =
      minPriceAggregate.length !== 0 ? minPriceAggregate[0].minPrice : null;
    const maxPrice =
      maxPriceAggregate.length !== 0 ? maxPriceAggregate[0].maxPrice : null;

    return { minPrice, maxPrice };
  }

  async deleteSubProductsByMasterProductId(
    masterProductId: string,
  ): Promise<string> {
    const subProductsByMasterProductId = await this.subProductModel.find({
      masterProductId,
    });
    if (!subProductsByMasterProductId) {
      throw new NotFoundException(
        'this masterproduct do not have any subproduct available, masterProductId: ' +
          masterProductId,
      );
    }

    await Promise.all(
      subProductsByMasterProductId.map(
        async (subProduct) =>
          await this.subProductModel.findByIdAndUpdate(subProduct._id, {
            status: 'ARCHIVED',
          }),
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
    if (!product || product.status !== 'PUBLISHED') {
      throw new BadRequestException('SubProduct not updated, _id: ' + _id);
    }
    return product;
  }

  async deleteSubProductById(_id: string) {
    const product = await this.subProductModel.findByIdAndUpdate(_id, {
      status: 'ARCHIVED',
    });
    if (!product) {
      throw new NotFoundException('SubProduct not deleted, _id: ' + _id);
    }
    return product;
  }
}
