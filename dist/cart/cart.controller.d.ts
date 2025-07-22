import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("../entities/cart-item.entity").CartItem[]>;
    addOrUpdateItem(req: any, dto: CreateCartItemDto): Promise<import("../entities/cart-item.entity").CartItem>;
    updateItemQuantity(req: any, productId: string, hub: string, dto: UpdateCartItemDto): Promise<import("../entities/cart-item.entity").CartItem>;
    removeItem(req: any, productId: number, hub: string): Promise<import("typeorm").DeleteResult>;
    clearCart(req: any): Promise<import("typeorm").DeleteResult>;
}
