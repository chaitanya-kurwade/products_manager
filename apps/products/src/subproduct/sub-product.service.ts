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
    userRole?: string,
  ): Promise<SubProductList> {
    const { page, limit, search, sortOrder, minPrice, maxPrice } =
      paginationInput;

    let query = this.subProductModel.find({ status: 'PUBLISHED' });
    let totalCountQuery = this.subProductModel.find({ status: 'PUBLISHED' });

    if (userRole === 'SUPER_ADMIN') {
      query = query.find({
        status: {
          $in: ['PUBLISHED', 'ARCHIVED'],
        },
      });
      totalCountQuery = totalCountQuery.find({
        status: {
          $in: ['PUBLISHED', 'ARCHIVED'],
        },
      });
    } else {
      query = query.find({
        status: 'PUBLISHED',
      });
      totalCountQuery = totalCountQuery.find({
        status: 'PUBLISHED',
      });
    }

    // getMinMaxPrices
    let fetched_ids: string[];
    let getMinMaxPrices: {
      minPrice: number;
      maxPrice: number;
      _ids: string[];
    };
    if (
      (minPrice === null && maxPrice === null) ||
      (minPrice === undefined && maxPrice === undefined)
    ) {
      getMinMaxPrices = await this.getMinMaxPricesForSubProducts(
        minPrice,
        maxPrice,
      );
      getMinMaxPrices.minPrice;
      getMinMaxPrices.maxPrice;
    } else if (minPrice !== 0 && maxPrice !== 0) {
      getMinMaxPrices = await this.getMinMaxPricesForSubProducts(
        minPrice,
        maxPrice,
      );
      minPrice;
      maxPrice;
      fetched_ids = getMinMaxPrices._ids;
    }
    // getting subProducts as per subProduct's price
    if (minPrice !== undefined && maxPrice !== undefined && fetched_ids) {
      query = query.where('_id').in(fetched_ids);
      totalCountQuery = totalCountQuery.where('_id').in(fetched_ids);
    }

    // categoryIds[] wise search
    if (categoryIds && categoryIds.length !== 0) {
      // const fetchedCategoriesId =
      //   await this.masterProductService.getAllCategoriesInMasterProduct(
      //     categoryIds,
      //   );
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
      query = query.sort(sortOrder);
    }
    query = query.sort(sortOptions);

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute queries
    const subProducts = await query.exec();
    const totalCount = await totalCountQuery.countDocuments().exec();

    const minPriceFromDb = await (await this.getMinMaxPricesFromDB()).minPrice;
    const maxPriceFromDb = await (await this.getMinMaxPricesFromDB()).maxPrice;

    return {
      subProducts,
      totalCount,
      minPrice: minPriceFromDb,
      maxPrice: maxPriceFromDb,
    };
  }

  async getMinMaxPricesFromDB() {
    const minMaxPricesFromDB = await this.subProductModel.aggregate([
      {
        $match: { status: 'PUBLISHED' },
      },
      {
        $group: {
          _id: null,
          minPriceFromDb: { $min: '$prices' },
          maxPriceFromDb: { $max: '$prices' },
        },
      },
    ]);

    if (minMaxPricesFromDB.length > 0) {
      const { minPriceFromDb, maxPriceFromDb } = minMaxPricesFromDB[0];
      return { minPrice: minPriceFromDb, maxPrice: maxPriceFromDb };
    } else {
      console.error("No documents found with status 'PUBLISHED'");
      return null;
    }
  }

  async getMinMaxPricesForSubProducts(
    minPrice?: number,
    maxPrice?: number,
  ): Promise<{
    minPrice: number;
    maxPrice: number;
    _ids: string[];
  }> {
    // minPrice === null && maxPrice === null
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
    // minPrice !== null && maxPrice !== null
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
            masterProductId: { $addToSet: '$_id' },
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
    } else if (
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
            masterProductId: { $addToSet: '$masterProductId' }, // Adding ids
          },
        },
      ];

      const minMaxPrices = await this.subProductModel
        .aggregate(minMaxPricePipeline)
        .exec();

      const masterProductIds =
        minMaxPrices.length !== 0 ? minMaxPrices[0].masterProductId : [];

      return {
        minPrice: minPrice,
        maxPrice: maxPrice,
        masterProductId: masterProductIds,
      };
    }
  }

  async getOneSubProductById(_id: string, role?: string) {
    const product = await this.subProductModel.findById(_id);
    if (role === 'SUPER_ADMIN') {
      return product;
    }
    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException(
        'SubProduct not available with _id: ' +
          _id +
          ', or it is not published',
      );
    }
    return product;
  }

  // async getSubProductsByMasterProductId(
  //   masterProductId: string,
  //   role?: string,
  // ) {
  //   const query: any = { masterProductId };

  //   if (role !== 'SUPER_ADMIN') {
  //     query.status = 'PUBLISHED';
  //   }

  //   const subProducts = await this.subProductModel.find(query).exec();

  //   if (!subProducts || subProducts.length === 0) {
  //     throw new NotFoundException(
  //       `SubProduct not available with ${masterProductId} masterProductId`,
  //     );
  //   }

  //   return subProducts;
  // }

  async getSubProductsByMasterProductId(
    masterProductId: string,
    role?: string,
  ) {
    const subProducts = await this.subProductModel
      .find({ masterProductId })
      .exec();
    console.log(subProducts);

    if (!subProducts || subProducts.length === 0) {
      throw new NotFoundException(
        'SubProduct not available with ' + masterProductId + ' masterProductId',
      );
    }

    if (role === 'SUPER_ADMIN') {
      console.log(subProducts);

      return subProducts;
    }

    const publishedProducts = subProducts.filter(
      (products) => products.status === 'PUBLISHED',
    );

    if (!publishedProducts || publishedProducts.length === 0) {
      throw new NotFoundException(
        'SubProducts not available with ' +
          masterProductId +
          ' masterProductId',
      );
    }
    return publishedProducts;
  }

  // async updateSubProductById(
  //   _id: string,
  //   updateSubProductInput: UpdateSubProductInput,
  //   role?: string,
  // ) {
  //   if (role === 'SUPER_ADMIN') {
  //     const subProduct = await this.subProductModel.findOne({
  //       _id: updateSubProductInput._id,
  //     });
  //     // console.log(subProduct);
  //     if (!subProduct) {
  //       throw new BadRequestException('SubProduct not updated, _id: ' + _id);
  //     }

  //     // checking if another sku is present in database or not
  //     const uniqueSkuSubProduct = await this.subProductModel.findOne({
  //       sku: subProduct.sku,
  //     });
  //     if (subProduct.sku === uniqueSkuSubProduct.sku) {
  //       console.log(subProduct.sku, uniqueSkuSubProduct.sku);

  //       const prod = await this.subProductModel.findByIdAndUpdate(
  //         _id,
  //         updateSubProductInput,
  //         { new: true },
  //       );
  //       console.log(prod);

  //       return prod;
  //     } else {
  //       throw new BadGatewayException('sku should be unique');
  //     }
  //   }

  //   const subProduct = await this.subProductModel.findOne({
  //     _id: updateSubProductInput._id,
  //     status: 'PUBLISHED',
  //   });
  //   if (!subProduct) {
  //     throw new BadRequestException('SubProduct not updated, _id: ' + _id);
  //   }

  //   // checking if another sku is present in database or not for same subProduct
  //   const uniqueSkuSubProduct = await this.subProductModel.findOne({
  //     sku: subProduct.sku,
  //   });
  //   if (subProduct.sku === uniqueSkuSubProduct.sku) {
  //     const prod = await this.subProductModel.findByIdAndUpdate(
  //       _id,
  //       updateSubProductInput,
  //       { new: true },
  //     );
  //     console.log(prod);
  //     return prod;
  //   } else {
  //     throw new BadGatewayException('sku should be unique');
  //   }
  // }

  async updateSubProductById(
    _id: string,
    updateSubProductInput: UpdateSubProductInput,
    role?: string,
  ) {
    if (role === 'SUPER_ADMIN') {
      const subProduct = await this.subProductModel.findById(_id);
      if (!subProduct) {
        throw new BadRequestException(`SubProduct not found with _id: ${_id}`);
      }
      const uniqueSkuSubProduct = await this.subProductModel.findOne({
        sku: updateSubProductInput.sku,
      });
      if (uniqueSkuSubProduct && uniqueSkuSubProduct._id.toString() !== _id) {
        throw new BadGatewayException('SKU should be unique');
      }
      return await this.subProductModel.findByIdAndUpdate(
        _id,
        updateSubProductInput,
        { new: true },
      );
    } else if (role !== 'SUPER_ADMIN') {
      const subProduct = await this.subProductModel.findById(_id);
      if (!subProduct || subProduct.status !== 'PUBLISHED') {
        throw new BadRequestException(`SubProduct not found with _id: ${_id}`);
      }
      const uniqueSkuSubProduct = await this.subProductModel.findOne({
        sku: updateSubProductInput.sku,
      });

      if (uniqueSkuSubProduct && uniqueSkuSubProduct._id.toString() !== _id) {
        throw new BadGatewayException('SKU should be unique');
      }
      return await this.subProductModel.findByIdAndUpdate(
        _id,
        updateSubProductInput,
        { new: true },
      );
    }
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

  async deleteSubProductById(_id: string) {
    const product = await this.subProductModel.findByIdAndDelete(_id);
    if (!product) {
      throw new NotFoundException('SubProduct not deleted, _id: ' + _id);
    }
    return product;
  }
}
