import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SubProductService } from './sub-product.service';

@Controller('subproducts')
export class SubProductController {
  constructor(private readonly subProductService: SubProductService) {}
}
