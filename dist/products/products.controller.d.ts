import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getCatalogProducts(categoryId: number, makeId: string, modelId: string, modificationId: string, manufacturers: string, warehouses: string, sortBy?: 'availability' | 'price' | '', sortDir?: 'ASC' | 'DESC', page?: number, limit?: number): Promise<{
        result: any;
        totalCount: any;
        warehouseDetails: never[];
    }>;
    getCatalogManufacturers(categoryId: number, modificationId?: number): Promise<{
        id: number;
        name: string;
    }[]>;
    getCatalogWarehouses(categoryId: number, modificationId?: number): Promise<{
        id: number;
        name: string;
    }[]>;
    getArticleProduct(skuFragment: string, page?: number, limit?: number): Promise<{
        result: any;
        totalCount: any;
        warehouseDetails: never[];
    }>;
    getOemProduct(oemNumber: string, page?: number, limit?: number): Promise<{
        result: any;
        totalCount: any;
        warehouseDetails: never[];
    }>;
    getProduct(sku: string): Promise<{
        attributes: any;
        photos: any;
        manufacturer_name: any;
        stock: any;
        oeNumbers: any;
        compatibility: any;
        id: number;
        name: string;
        sku: string;
        category_id: number;
        manufacturer_id: number;
    } | null>;
}
