import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
}
