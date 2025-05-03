export declare class CreateProductDto {
    type: string;
    vendor: string;
    model: string;
    price: number;
    images: string[];
    characteristics?: Record<string, any>;
}
