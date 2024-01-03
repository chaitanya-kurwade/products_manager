import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
  ){}

  async create(createCategoryInput: CreateCategoryInput) {
    const category = await this.categoryModel.create(createCategoryInput);
    if (!category) {
      throw new NotFoundException("Category already exists");
    }
    return category;
  }

  async findAll() {
    const category = await this.categoryModel.find();
    if (!category && category.length === 0) {
      throw new NotFoundException();
    }
    return category;
  }

  async findOne(_id: string) {
    const category = await this.categoryModel.findById(_id);
    if (!category) {
      throw new NotFoundException("category not found, _id: "+ _id);
    }
    return category;
  }

  async update(_id: string, updateCategoryInput: UpdateCategoryInput) {
    const category = await this.categoryModel.findByIdAndUpdate(_id, updateCategoryInput);
    if (!category) {
      throw new BadGatewayException("category not updated, _id: " + _id);
    }
    return category;
  }

  async remove(_id: string) {
    const category = await this.categoryModel.findByIdAndDelete(_id);
    if (!category) {
      throw new NotFoundException("Catogory not deleted, _id: " + _id);
    }
    return category;
  }
}
