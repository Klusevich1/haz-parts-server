import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createSession(body: {
        products: {
            name: string;
            price: number;
        }[];
    }): Promise<{
        url: string | null;
    }>;
}
