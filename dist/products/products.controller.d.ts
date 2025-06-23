import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getCatalogProducts(categoryId: number, modelId: number | null, modificationId: number | null, manufacturerId: number | null, makeId: number | null, warehouseId: number | null, sortBy?: 'name' | 'price', sortDir?: 'ASC' | 'DESC', page?: number, limit?: number): Promise<any>;
    getProduct(sku: string): Promise<{
        attributes: any;
        photos: any;
        stock: any;
        oeNumbers: any;
        compatibility: any;
        id: string;
        name: string;
        sku: string;
        price: number;
        description: string;
        category: import("../categories/category.entity").Category;
        brands: import("./product.entity").Brand[];
        models: import("./product.entity").Model[];
        modifications: import("./product.entity").Modification[];
    } | null>;
    getArticleProduct(articleId: number): Promise<any>;
    getOemProduct(articleId: number): Promise<any>;
}
