import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { PaginationInput } from 'common/library/pagination/inputs/pagination.input';
import { CategoryList } from './responses/category-lists-response.entity';
import { ROLES } from 'apps/auth/src/users/enums/role.enum';
import { Roles } from 'common/library/decorators/roles.decorator';
import { Request } from 'express';
import { ContextService } from 'common/library/service/context.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MANAGER)
  @Query(() => CategoryList, { name: 'categories' })
  async getAllCategories(
    @Context() context: { req: Request },
    @Args('paginationInput', { nullable: true })
    paginationInput: PaginationInput,
    @Args('searchFields', { type: () => [String], nullable: true })
    searchFields?: string[],
  ): Promise<CategoryList> {
    const { role } = await new ContextService().getContextInfo(context.req);
    const categoryList = await this.categoryService.findAll(
      paginationInput,
      searchFields ?? [],
      role,
    );
    return categoryList;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MANAGER)
  @Query(() => Category, { name: 'category' })
  getCategoryById(@Args('_id') _id: string) {
    return this.categoryService.getCategoryById(_id);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MANAGER)
  @Query(() => Category, { name: 'getChildCategory' })
  getChildCategoryByCategoryId(@Args('_id') _id: string) {
    return this.categoryService.getChildCategoryByCategoryId(_id);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput._id,
      updateCategoryInput,
    );
  }

  // @Mutation(() => Category)
  // removeCategory(@Args('_id') _id: string) {
  //   return this.categoryService.remove(_id);
  // }
}
