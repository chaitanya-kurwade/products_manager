import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { MasterProduct } from './entities/master-product.entity';
import { MasterProductService } from './master-product.service';
import { CreateMasterProductInput } from './inputs/create-master-product.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';
import { PaginationInput } from 'common/library';
import { MasterProductList } from './responses/master-products-list.response.entity';
import { Roles } from 'common/library/decorators/roles.decorator';
import { ROLES } from 'apps/auth/src/users/enums/role.enum';
import { Request } from 'express';
import { ContextService } from 'common/library/service/context.service';

@Resolver(() => MasterProduct)
export class MasterProductResolver {
  constructor(private readonly masterProductService: MasterProductService) {}

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => MasterProduct)
  createMasterProduct(
    @Args('createMasterProductInput')
    createMasterProductInput: CreateMasterProductInput,
  ) {
    return this.masterProductService.createMasterProduct(createMasterProductInput);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MANAGER)
  @Query(() => MasterProductList, { name: 'getAllMasterProduct' })
  async getAllMasterProducts(
    @Context() context: { req: Request },
    @Args('paginationInput', { nullable: true })
    paginationInput: PaginationInput,
    @Args('searchFields', { type: () => [String], nullable: true })
    searchFields?: string[],
    @Args('categoryIds', { type: () => [String], nullable: true })
    categoryIds?: string[],
  ): Promise<MasterProductList> {
    const { role } = await new ContextService().getContextInfo(context.req);

    const products = await this.masterProductService.getAllMasterProducts(
      paginationInput,
      searchFields ?? [],
      categoryIds ?? [],
      role,
    );
    return products;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MANAGER)
  @Query(() => MasterProduct, { name: 'getMasterProduct' })
  async getOneMasterProductById(@Args('_id') _id: string, @Context() context: { req: Request }) {
    const { role } = await new ContextService().getContextInfo(context.req);

    const masterProduct = await this.masterProductService.getOneMasterProductById(_id, role);
    return masterProduct;
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => MasterProduct)
  async updateMasterProductById(
    @Context() context: { req: Request },
    @Args('updateMasterProductInput')
    updateMasterProductInput: UpdateMasterProductInput,
  ) {
    const { role } = await new ContextService().getContextInfo(context.req);

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

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => String)
  deleteCategoryById(@Args('categoryId', { type: () => String }) categoryId: string) {
    return this.masterProductService.deleteCategoryAndMasterProduct(categoryId);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Mutation(() => String)
  deleteMasterProduct(@Args('masterProductId', { type: () => String }) masterProductId: string) {
    return this.masterProductService.deleteMasterProductAndItsSubProducts(masterProductId);
  }
}
