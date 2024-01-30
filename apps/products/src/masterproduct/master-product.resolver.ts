import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MasterProduct } from './entities/master-product.entity';
import { MasterProductService } from './master-product.service';
import { CreateMasterProductInput } from './inputs/create-masterproduct.input';
import { UpdateMasterProductInput } from './inputs/update-masterproduct.input';

@Resolver(() => MasterProduct)
export class MasterProductResolver {
  constructor(private readonly masterProductService: MasterProductService) {}

  @Mutation(() => MasterProduct)
  createMasterProduct(
    @Args('createMasterProductInput')
    createMasterProductInput: CreateMasterProductInput,
  ) {
    return this.masterProductService.createMasterProduct(
      createMasterProductInput,
    );
  }

  @Query(() => [MasterProduct], { name: 'getAllMasterProduct' })
  getAllMasterProducts() {
    return this.masterProductService.getAllMasterProducts();
  }

  @Query(() => MasterProduct, { name: 'getMasterProduct' })
  getOneMasterProductById(@Args('_id') _id: string) {
    return this.masterProductService.getOneMasterProductById(_id);
  }

  @Mutation(() => MasterProduct)
  updateMasterProductById(
    @Args('updateMasterProductInput')
    updateMasterProductInput: UpdateMasterProductInput,
  ) {
    return this.masterProductService.updateMasterProductById(
      updateMasterProductInput._id,
      updateMasterProductInput,
    );
  }

  @Mutation(() => MasterProduct)
  deleteMasterProductById(@Args('_id', { type: () => Int }) _id: string) {
    return this.masterProductService.deleteMasterProductById(_id);
  }
}
