import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { PaginationInput } from 'common/library/pagination/inputs/pagination.input';
import { CategoryList } from './responses/category-lists-response.entity';
import { ROLES } from 'apps/auth/src/users/enums/role.enum';
import { Roles } from 'common/library/decorators/roles.decorator';
import { CurrentUser } from 'common/library/decorators/current-user.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => Category)
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoryService.create(createCategoryInput);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER)
  @Query(() => CategoryList, { name: 'categories' })
  async getAllCategories(
    @CurrentUser('role') role: string,
    @Args('paginationInput', { nullable: true })
    paginationInput: PaginationInput,
    @Args('searchFields', { type: () => [String], nullable: true })
    searchFields?: string[],
  ): Promise<CategoryList> {
    const categoryList = await this.categoryService.getAllCategories(
      paginationInput,
      searchFields ?? [],
      role,
    );
    return categoryList;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER)
  @Query(() => Category, { name: 'categoryById' })
  async getCategoryById(@CurrentUser('role') role: string, @Args('_id') _id: string) {
    const category = await this.categoryService.getCategoryById(_id, role);
    return category;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER)
  @Query(() => [Category], { name: 'getChildCategory' })
  async getChildCategoryByCategoryId(@CurrentUser('role') role: string, @Args('_id') _id: string) {
    const childCategory = await this.categoryService.getChildCategoryByCategoryId(_id, role);
    return childCategory;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => Category)
  async updateCategoryById(
    @CurrentUser('role') role: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    const updateCategory = await this.categoryService.updateCategoryById(
      updateCategoryInput._id,
      updateCategoryInput,
      role,
    );
    return updateCategory;
  }

  // @Mutation(() => Category)
  // removeCategory(@Args('_id') _id: string) {
  //   return this.categoryService.remove(_id);
  // }
}
