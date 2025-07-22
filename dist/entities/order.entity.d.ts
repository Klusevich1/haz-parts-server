export declare class Order {
    id: number;
    userId: number;
    orderNumber: number;
    fullname: string;
    email: string;
    deliveryMethod: string;
    address: string;
    payment: string;
    comment?: string;
    items: any[];
    createdAt: Date;
}
