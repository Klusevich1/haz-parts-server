import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getFilteredProducts(categorySlug?: string, brandSlug?: string, modelSlug?: string, modificationSlug?: string): Promise<import("./product.entity").Product[]>;
}
