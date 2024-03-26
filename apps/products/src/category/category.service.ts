import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { PaginationInput } from 'common/library/pagination/inputs/pagination.input';
import { CategoryList } from './responses/category-lists-response.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const existingCategory = await this.categoryModel.findOne({
      categoryName: createCategoryInput.categoryName,
    });
    if (existingCategory) {
      throw new BadGatewayException('Category already exists');
    }

    let ancestors = [];
    if (createCategoryInput.immediateParentId) {
      const parentCategory = await this.categoryModel.findById(
        createCategoryInput.immediateParentId,
      );

      if (parentCategory) {
        ancestors = parentCategory.ancestors || [];
        const ancestorExists = ancestors.some((ancestor) =>
          ancestor.id.equals(parentCategory._id),
        );
        if (!ancestorExists) {
          ancestors.unshift({
            id: parentCategory._id,
            categoryName: parentCategory.categoryName,
            sortingOrder: ancestors.length + 1,
          });
        }
      }
    }
    const newCategory = await this.categoryModel.create({
      ...createCategoryInput,
      ancestors,
    });
    if (!newCategory) {
      throw new BadGatewayException('Category not created');
    }
    return newCategory;
  }

  async getAllCategories(
    paginationInput: PaginationInput,
    searchFields?: string[],
    userRole?: string,
  ): Promise<CategoryList> {
    const { page, limit, search, sortOrder } = paginationInput;

    let query = this.categoryModel.find({ status: 'PUBLISHED' });
    let totalCountQuery = this.categoryModel.find({ status: 'PUBLISHED' });

    if (userRole === 'SUPER_ADMIN') {
      query = query.where('status').in(['PUBLISHED', 'ARCHIVED']);
      totalCountQuery = totalCountQuery
        .where('status')
        .in(['PUBLISHED', 'ARCHIVED']);
    } else {
      query = query.where('status').equals('PUBLISHED');
      totalCountQuery = totalCountQuery.where('status').equals('PUBLISHED');
    }

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

    const categories = await query.exec();

    const totalCount = await totalCountQuery.countDocuments();

    return { categories, totalCount };
  }

  async getCategoryById(_id: string, role?: string) {
    const category = await this.categoryModel.findById(_id);
    if (role === 'SUPER_ADMIN') {
      return category;
    }
    if (!category || category.status !== 'PUBLISHED') {
      throw new NotFoundException(
        'category not available with _id: ' + _id + ', or it is not published',
      );
    }
    return category;
  }

  async getChildCategoryByCategoryId(categoryId: string, role?: string) {
    const childCategories = await this.categoryModel.find({
      immediateParentId: categoryId,
    });
    if (!childCategories || childCategories.length === 0) {
      throw new NotFoundException('Child category not found');
    }
    if (role === 'SUPER_ADMIN') {
      return childCategories;
    } else {
      const categories =
        childCategories.filter((category) => category.status === 'PUBLISHED') ||
        [];
      return categories;
    }
  }

  async updateCategoryById(
    _id: string,
    updateCategoryInput: UpdateCategoryInput,
    role?: string,
  ) {
    if (role === 'SUPER_ADMIN') {
      const category = await this.categoryModel.findByIdAndUpdate(
        _id,
        updateCategoryInput,
        { new: true },
      );
      return category.save();
    }

    const category = await this.categoryModel.findById(_id);
    if (!category || category.status !== 'PUBLISHED') {
      throw new BadGatewayException(
        `Category not found with id: ${_id} or Category status is not 'PUBLISHED'`,
      );
    }
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      _id,
      updateCategoryInput,
      { new: true },
    );
    return updatedCategory;
  }

  async remove(_id: string) {
    const category = await this.categoryModel.findById(_id);
    if (!category) {
      throw new NotFoundException('Catogory not deleted, _id: ' + _id);
    }
    category.status = 'ARCHIVED';
    return category.save();
  }

  async convertPublishedToArchive(_id: string) {
    return this.categoryModel.findByIdAndUpdate(_id, {
      $set: { status: 'ARCHIVED' },
    });
  }
}
