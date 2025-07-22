import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto): Promise<{
        success: boolean;
        message: string;
        orderNumber: number;
    }>;
}
