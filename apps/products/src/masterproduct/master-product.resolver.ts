import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MasterProduct } from './entities/master-product.entity';
import { MasterProductService } from './master-product.service';
import { CreateMasterProductInput } from './inputs/create-master-product.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';
import { PaginationInput } from 'common/library';
import { MasterProductList } from './responses/master-products-list.response.entity';
import { Roles } from 'common/library/decorators/roles.decorator';
import { ROLES } from 'common/library/enums/role.enum';
import { Request } from 'express';
import { ContextService } from 'common/library/service/context.service';
import { CurrentUser } from 'common/library/decorators/current-user.decorator';

@Resolver(() => MasterProduct)
export class MasterProductResolver {
  constructor(private readonly masterProductService: MasterProductService) {}
  //     @CurrentUser('role') role: string,
  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => MasterProduct)
  createMasterProduct(
    @Args('createMasterProductInput')
    createMasterProductInput: CreateMasterProductInput,
  ) {
    return this.masterProductService.createMasterProduct(createMasterProductInput);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER)
  @Query(() => MasterProductList, { name: 'getAllMasterProduct' })
  async getAllMasterProducts(
    @CurrentUser('role') role: string,
    @Args('paginationInput', { nullable: true })
    paginationInput: PaginationInput,
    @Args('searchFields', { type: () => [String], nullable: true })
    searchFields?: string[],
    @Args('categoryIds', { type: () => [String], nullable: true })
    categoryIds?: string[],
  ): Promise<MasterProductList> {
    const products = await this.masterProductService.getAllMasterProducts(
      paginationInput,
      searchFields ?? [],
      categoryIds ?? [],
      role,
    );
    return products;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER)
  @Query(() => MasterProduct, { name: 'getMasterProduct' })
  async getOneMasterProductById(@Args('_id') _id: string, @CurrentUser('role') role: string) {
    const masterProduct = await this.masterProductService.getOneMasterProductById(_id, role);
    return masterProduct;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => MasterProduct)
  async updateMasterProductById(
    @CurrentUser('role') role: string,

    @Args('updateMasterProductInput')
    updateMasterProductInput: UpdateMasterProductInput,
  ) {
    const updatedMasterProduct = await this.masterProductService.updateMasterProductById(
      updateMasterProductInput._id,
      updateMasterProductInput,
      role,
    );

    return updatedMasterProduct;
  }

  // @Mutation(() => MasterProduct)
  // deleteMasterProductById(@Args('_id', { type: () => String }) _id: string) {
  //   return this.masterProductService.deleteMasterProductById(_id);
  // }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => String)
  deleteCategoryById(@Args('categoryId', { type: () => String }) categoryId: string) {
    return this.masterProductService.deleteCategoryAndMasterProduct(categoryId);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Mutation(() => String)
  deleteMasterProduct(@Args('masterProductId', { type: () => String }) masterProductId: string) {
    return this.masterProductService.deleteMasterProductAndItsSubProducts(masterProductId);
  }
}
