import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
  ) {}

  async getCart(userId: number): Promise<CartItem[]> {
    return this.repo.query(`SELECT * FROM cartitems WHERE user_id = ?`, [
      userId,
    ]);
  }

  async addOrUpdateItem(userId: number, dto: CreateCartItemDto) {
    const existing = await this.repo.findOne({
      where: { userId: userId, productId: dto.productId, hub: dto.hub },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.repo.save(existing);
    }

    const newItem = this.repo.create({ ...dto, userId });
    return this.repo.save(newItem);
  }

  async updateItemQuantity(
    userId: number,
    productId: number,
    hub: string,
    dto: UpdateCartItemDto,
  ) {
    const item = await this.repo.findOne({
      where: { userId: userId, productId: productId, hub },
    });
    if (!item) throw new NotFoundException('Item not found');
    item.quantity = Math.min(Math.max(dto.quantity, 1), item.availability);
    return this.repo.save(item);
  }

  async removeItem(userId: number, productId: number, hub: string) {
    return this.repo.delete({ userId, productId: productId, hub });
  }

  async clearCart(userId: number) {
    return this.repo.delete({ userId: userId });
  }
}
