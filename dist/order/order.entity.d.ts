import { User } from '../user/entities/user.entity';
export declare class Order {
    id: number;
    orderNumber: number;
    name: string;
    lastName: string;
    userPhone: string;
    userMail: string;
    orderPrice: number;
    cartItems: any;
    deliveryType: string;
    deliveryAddress: string;
    paymentMethod: string;
    comment: string;
    user: User;
    createdAt: Date;
}
