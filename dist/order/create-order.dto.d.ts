export declare class CreateOrderDto {
    orderNumber: number;
    name: string;
    lastName: string;
    userPhone: string;
    userMail?: string;
    orderPrice: number;
    cartItems: any[];
    deliveryType: string;
    deliveryAddress: string;
    paymentMethod?: string;
    comment?: string;
}
