import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubProductInput } from './inputs/create-subproduct.input';
import { UpdateSubProductInput } from './inputs/update-subproduct.input';
import { InjectModel } from '@nestjs/mongoose';
import { SubPorductDocument, SubProduct } from './entities/sub-product.entity';
import { Model, SortOrder } from 'mongoose';
import { PaginationInput } from 'common/library';

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

  async getAllSubProducts(
    paginationInput: PaginationInput,
    searchFields?: string[],
  ) {
    let query = this.subProductModel.find();
    const { page, limit, search, sortField, sortOrder, maxPrice, minPrice } =
      paginationInput;
    if (searchFields == null || !searchFields.length) {
      if (search) {
        query = query.where('subProductName').regex(new RegExp(search, 'i'));
      }
      if (search && minPrice !== undefined && maxPrice !== undefined) {
        query = query
          .find({
            $and: [
              // { $text: { $search: search } },
              { prices: { $gte: minPrice, $lte: maxPrice } },
            ],
          })
          .where('subProductName')
          .regex(new RegExp(search, 'i'))
          .sort({ prices: 1 });
      } else if (minPrice !== undefined && maxPrice !== undefined) {
        query = query
          .find({ prices: { $gte: minPrice, $lte: maxPrice } }) // Only price range filter
          .sort({ prices: 1 }); // Sorting by price in ascending order
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
        throw new NotFoundException('SubProduct not found');
      }
      return products;
    } else {
      {
        query = this.buildQuery(search, searchFields);
        console.log(query);
        if (!page && !limit && !sortField && !sortOrder) {
          return query.sort({ createdAt: -1 }).exec();
        }
        if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
          throw new BadRequestException(
            'Invalid sortOrder. It must be either ASC or DESC.',
          );
        }
        if (search && minPrice !== undefined && maxPrice !== undefined) {
          query = query.find({
            $and: [
              // { $text: { $search: search } },
              { prices: { $gte: minPrice, $lte: maxPrice } },
            ],
          });
        } else if (minPrice !== undefined && maxPrice !== undefined) {
          query = query
            .find({ prices: { $gte: minPrice, $lte: maxPrice } })
            .sort({ prices: 1 });
        }
        if (sortField && sortOrder) {
          console.log(sortOrder, 'single', sortField);
          const sortOptions: { [key: string]: SortOrder } = {};
          sortOptions[sortField] = sortOrder.toLowerCase() as SortOrder;
          query = query.sort(sortOptions);
        }
        const skip = (page - 1) * limit;
        const products = await query.skip(skip).limit(limit).exec();
        if (!products && products.length == 0) {
          throw new NotFoundException('SubProduct not found');
        }
        return products;
      }
    }
  }

  private buildQuery(search: string, searchFields?: string[]): any {
    let query = this.subProductModel.find();
    if (search) {
      const orConditions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search, 'i') },
      }));
      query = query.or(orConditions);
    }
    return query;
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
