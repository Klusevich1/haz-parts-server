import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';
export declare class OrderService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    createOrder(createOrderDto: CreateOrderDto): Promise<Order>;
}
