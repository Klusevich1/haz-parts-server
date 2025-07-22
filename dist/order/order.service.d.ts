import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import { ConfigService } from '@nestjs/config';
export declare class OrderService {
    private readonly orderRepository;
    private readonly configService;
    private transporter;
    constructor(orderRepository: Repository<Order>, configService: ConfigService);
    createOrder(dto: CreateOrderDto): Promise<{
        success: boolean;
        message: string;
        orderNumber: number;
    }>;
}
