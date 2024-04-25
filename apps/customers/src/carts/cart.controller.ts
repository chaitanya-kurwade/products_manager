import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartsService) {}

  @EventPattern('subproduct', { async: true })
  async addSubProductToCard(@Payload() subProduct: any) {
    return this.cartService.addProductToCart(subProduct);
  }
}
