import { Controller } from '@nestjs/common';
import { SubProductService } from './sub-product.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SubProduct } from './entities/sub-product.entity';

@Controller('subproduct')
export class SubProductController {
  constructor(private readonly subProductService: SubProductService) {}
  @EventPattern('subproduct', { async: true })
  async getSubProductById(@Payload() subProductId: string): Promise<SubProduct> {
    return this.subProductService.getOneSubProductById(subProductId);
  }
}
