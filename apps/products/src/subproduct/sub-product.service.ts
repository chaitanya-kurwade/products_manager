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
    const existingSkuSubProduct = await this.subProductModel.findOne({
      sku: createSubProductInput.sku,
    });
    if (existingSkuSubProduct) {
      throw new BadGatewayException(
        'sku already exists with this name:' + existingSkuSubProduct.sku,
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
    categoryIds?: string[],
  ): Promise<SubProductList> {
    const { page, limit, search, sortOrder, minPrice, maxPrice } =
      paginationInput;

    let query = this.subProductModel.find({ status: 'PUBLISHED' });
    let totalCountQuery = this.subProductModel.find({ status: 'PUBLISHED' });

    // getMinMaxPrices
    let fetched_ids: string[];
    let getMinMaxPrices: {
      minPrice: number;
      maxPrice: number;
      _ids: string[];
    };
    if (minPrice !== 0 && maxPrice !== 0) {
      getMinMaxPrices = await this.getMinMaxPricesForSubProducts(
        minPrice,
        maxPrice,
      );
      getMinMaxPrices.minPrice;
      getMinMaxPrices.maxPrice;
      fetched_ids = getMinMaxPrices._ids;
    } else if (
      (minPrice === null && maxPrice === null) ||
      (minPrice === undefined && maxPrice === undefined)
    ) {
      getMinMaxPrices = await this.getMinMaxPricesForSubProducts(
        minPrice,
        maxPrice,
      );
      getMinMaxPrices.minPrice;
      getMinMaxPrices.maxPrice;
    }
    // getting subProducts as per subProduct's price
    if (minPrice !== undefined && maxPrice !== undefined && fetched_ids) {
      query = query.where('_id').in(fetched_ids);
      totalCountQuery = totalCountQuery.where('_id').in(fetched_ids);
    }

    // categoryIds[] wise search
    if (categoryIds && categoryIds.length !== 0) {
      query = query.where('categoryId').in(categoryIds);
      totalCountQuery = totalCountQuery.where('categoryId').in(categoryIds);
    }

    // Apply search fields
    if (search && searchFields && searchFields.length !== 0) {
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      const $orCondition = { $or: searchQueries };
      query = query.find($orCondition);
      totalCountQuery = totalCountQuery.find($orCondition);
    }

    // Filter by subProductIds
    if (fetched_ids && fetched_ids.length !== 0) {
      query = query.where('_id').in(fetched_ids);
      totalCountQuery = totalCountQuery.where('_id').in(fetched_ids);
    }

    // Filter by masterProductIds
    if (masterProductIds && masterProductIds.length !== 0) {
      query = query.where('masterProductId').in(masterProductIds);
      totalCountQuery = totalCountQuery
        .where('masterProductId')
        .in(masterProductIds);
    }

    // Sort options
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

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute queries
    const subProducts = await query.exec();
    const totalCount = await totalCountQuery.countDocuments().exec();

    return {
      subProducts,
      totalCount,
      minPrice: getMinMaxPrices.minPrice,
      maxPrice: getMinMaxPrices.maxPrice,
    };
  }

  async getMinMaxPricesForSubProducts(
    minPrice?: number,
    maxPrice?: number,
  ): Promise<{
    minPrice: number;
    maxPrice: number;
    _ids: string[];
  }> {
    // If either or both minPrice and maxPrice are not provided, aggregate the prices
    if (
      (minPrice === null && maxPrice === null) ||
      (minPrice === undefined && maxPrice === undefined)
    ) {
      const minMaxPricePipeline = [
        {
          $match: {
            status: 'PUBLISHED',
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$prices' },
            maxPrice: { $max: '$prices' },
            _ids: { $addToSet: '$_id' },
          },
        },
      ];

      const minMaxPrices = await this.subProductModel
        .aggregate(minMaxPricePipeline)
        .exec();

      const minPriceValue =
        minMaxPrices.length !== 0 ? minMaxPrices[0].minPrice : null;
      const maxPriceValue =
        minMaxPrices.length !== 0 ? minMaxPrices[0].maxPrice : null;
      const _ids = minMaxPrices.length !== 0 ? minMaxPrices[0]._id : [];

      return {
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        _ids: _ids,
      };
    }

    // If both minPrice and maxPrice are provided, execute the pipeline to get the price range
    else if (
      (minPrice !== null && maxPrice !== null) ||
      (minPrice !== undefined && maxPrice !== undefined)
    ) {
      const minMaxPricePipeline = [
        {
          $match: {
            status: 'PUBLISHED',
            prices: { $gte: minPrice, $lte: maxPrice },
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$prices' },
            maxPrice: { $max: '$prices' },
            masterProductId: { $addToSet: '$_id' }, // Add IDs of products to the result
          },
        },
      ];

      const minMaxPrices = await this.subProductModel
        .aggregate(minMaxPricePipeline)
        .exec();

      // minMaxPrices.length !== 0 ? minMaxPrices[0].minPrice : null;
      // minMaxPrices.length !== 0 ? minMaxPrices[0].maxPrice : null;
      const _ids =
        minMaxPrices.length !== 0 ? minMaxPrices[0].masterProductId : [];

      return {
        minPrice: minPrice,
        maxPrice: maxPrice,
        _ids: _ids,
      };
    }
  }

  async getMinMaxPricesForMasterProducts(
    minPrice?: number,
    maxPrice?: number,
  ): Promise<{
    minPrice: number;
    maxPrice: number;
    masterProductId: string[];
  }> {
    // If either or both minPrice and maxPrice are not provided, aggregate the prices
    if (
      (minPrice === null && maxPrice === null) ||
      (minPrice === undefined && maxPrice === undefined)
    ) {
      const minMaxPricePipeline = [
        {
          $match: {
            status: 'PUBLISHED',
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$prices' },
            maxPrice: { $max: '$prices' },
            masterProductId: { $addToSet: '$masterProductId' },
          },
        },
      ];

      const minMaxPrices = await this.subProductModel
        .aggregate(minMaxPricePipeline)
        .exec();

      const minPriceValue =
        minMaxPrices.length !== 0 ? minMaxPrices[0].minPrice : null;
      const maxPriceValue =
        minMaxPrices.length !== 0 ? minMaxPrices[0].maxPrice : null;
      const masterProductIds =
        minMaxPrices.length !== 0 ? minMaxPrices[0].masterProductId : [];

      return {
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        masterProductId: masterProductIds,
      };
    }

    // If both minPrice and maxPrice are provided, execute the pipeline to get the price range
    else if (
      (minPrice !== null && maxPrice !== null) ||
      (minPrice !== undefined && maxPrice !== undefined)
    ) {
      const minMaxPricePipeline = [
        {
          $match: {
            status: 'PUBLISHED',
            prices: { $gte: minPrice, $lte: maxPrice },
          },
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$prices' },
            maxPrice: { $max: '$prices' },
            masterProductId: { $addToSet: '$masterProductId' }, // Add IDs of products to the result
          },
        },
      ];

      const minMaxPrices = await this.subProductModel
        .aggregate(minMaxPricePipeline)
        .exec();

      // minMaxPrices.length !== 0 ? minMaxPrices[0].minPrice : null;
      // minMaxPrices.length !== 0 ? minMaxPrices[0].maxPrice : null;
      const masterProductIds =
        minMaxPrices.length !== 0 ? minMaxPrices[0].masterProductId : [];

      return {
        minPrice: minPrice,
        maxPrice: maxPrice,
        masterProductId: masterProductIds,
      };
    }
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
    const subProductOfExistingSku = await this.subProductModel.findOne({
      sku: updateSubProductInput.sku,
    });

    if (subProductOfExistingSku) {
      throw new BadGatewayException(
        'Product not updated. Product already exists with sku: ' +
          subProductOfExistingSku.sku,
      );
    }

    const product = await this.subProductModel.findByIdAndUpdate(
      _id,
      updateSubProductInput,
      { new: true, runValidators: true },
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
