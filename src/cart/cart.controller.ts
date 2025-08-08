import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addOrUpdateItem(@Req() req, @Body() dto: CreateCartItemDto) {
    console.log(dto)
    return this.cartService.addOrUpdateItem(req.user.id, dto);
  }

  @Patch(':productId/:hub')
  updateItemQuantity(
    @Req() req,
    @Param('productId') productId: string,
    @Param('hub') hub: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.id,
      Number(productId),
      hub,
      dto,
    );
  }

  @Delete(':productId/:hub')
  removeItem(
    @Req() req,
    @Param('productId') productId: number,
    @Param('hub') hub: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId, hub);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
