import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { PaginationInput } from 'common/library/pagination/inputs/pagination.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  // async create(createCategoryInput: CreateCategoryInput) {
  //   const category = await this.categoryModel.create(createCategoryInput);
  //   if (!category && category.categoryName) {
  //     throw new BadGatewayException('Category already exists');
  //   }
  //   return category;
  // }

  async create(createCategoryInput: CreateCategoryInput) {
    const existingCategory = await this.categoryModel.findOne({
      categoryName: createCategoryInput.categoryName,
    });
    if (existingCategory) {
      throw new BadGatewayException('Category already exists');
    }

    const newCategory = await this.categoryModel.create(createCategoryInput);
    if (!newCategory) {
      throw new BadGatewayException('Category not created');
    }
    return newCategory;
  }

  async findAll(
    paginationInput: PaginationInput,
    searchFields?: string[],
  ): Promise<Category[]> {
    const { page, limit, search, sortField, sortOrder } = paginationInput;
    let query = this.categoryModel.find();
    if (searchFields == null || !searchFields.length) {
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        throw new BadRequestException(
          'Invalid sortOrder. It must be either ASC or DESC.',
        );
      }
      if (search) {
        query = query.where('categoryName').regex(new RegExp(search, 'i'));
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
      if (!page && !limit && !sortField && !sortOrder) {
        return query.sort({ createdAt: -1 }).exec();
      }
      const skip = (page - 1) * limit;
      const categories = await query.skip(skip).limit(limit).exec();
      if (!categories && categories.length === 0) {
        throw new NotFoundException('Categories not found');
      }
      return categories;
    } else {
      query = this.buildQuery(search, searchFields);
      // console.log(query);
      if (!page && !limit && !sortField && !sortOrder) {
        return query.sort({ createdAt: -1 }).exec();
      }
      if (sortField && !['ASC', 'DESC'].includes(sortOrder)) {
        console.log(sortOrder, 'sortOrder', sortField);
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
      const categories = await query.skip(skip).limit(limit).exec();
      if (!categories && categories.length == 0) {
        throw new NotFoundException('Categories not found');
      }
      return categories;
    }
  }

  private buildQuery(search: string, searchFields?: string[]): any {
    let query = this.categoryModel.find();
    if (search) {
      const orConditions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search, 'i') },
      }));
      query = query.or(orConditions);
    }
    return query;
  }

  async getCategoryById(_id: string) {
    const category = await this.categoryModel.findById(_id);
    if (!category) {
      throw new NotFoundException('category not found with _id: ' + _id);
    }
    return category;
  }

  async update(_id: string, updateCategoryInput: UpdateCategoryInput) {
    const category = await this.categoryModel.findByIdAndUpdate(
      _id,
      updateCategoryInput,
    );
    if (!category) {
      throw new BadGatewayException('category not updated, _id: ' + _id);
    }
    return category;
  }

  async remove(_id: string) {
    const category = await this.categoryModel.findByIdAndDelete(_id);
    if (!category) {
      throw new NotFoundException('Catogory not deleted, _id: ' + _id);
    }
    return category;
  }
}
