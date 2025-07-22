import { CartItem } from 'src/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private readonly repo;
    constructor(repo: Repository<CartItem>);
    getCart(userId: number): Promise<CartItem[]>;
    addOrUpdateItem(userId: number, dto: CreateCartItemDto): Promise<CartItem>;
    updateItemQuantity(userId: number, productId: number, hub: string, dto: UpdateCartItemDto): Promise<CartItem>;
    removeItem(userId: number, productId: number, hub: string): Promise<import("typeorm").DeleteResult>;
    clearCart(userId: number): Promise<import("typeorm").DeleteResult>;
}
