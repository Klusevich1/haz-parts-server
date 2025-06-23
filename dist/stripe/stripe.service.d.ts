export declare class StripeService {
    private stripe;
    createCheckoutSession(products: {
        name: string;
        price: number;
    }[]): Promise<{
        url: string | null;
    }>;
}
