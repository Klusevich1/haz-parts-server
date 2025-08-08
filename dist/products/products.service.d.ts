import { Category } from 'src/entities/category.entity';
import { Make } from 'src/entities/make.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
import { Model } from 'src/entities/model.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    private makeRepository;
    private modelRepository;
    private modificationRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, makeRepository: Repository<Make>, modelRepository: Repository<Model>, modificationRepository: Repository<ModelModification>);
    getCatalogProducts(params: {
        categoryId: number;
        makeIdNum?: number;
        modelIdNum?: number;
        modificationIdNum?: number;
        manufacturerIds?: number[];
        warehouseIds?: number[];
        sortBy?: 'availability' | 'price' | '';
        sortDir?: 'ASC' | 'DESC';
        page?: number;
        limit?: number;
    }): Promise<{
        result: never[];
        totalCount: any;
        warehouseDetails: never[];
    }>;
    getCatalogManufacturers(params: {
        categoryId: number;
        modelId?: number;
        modificationId?: number;
        makeId?: number;
        warehouseId?: number;
    }): Promise<{
        id: number;
        name: string;
    }[]>;
    getCatalogWarehouses(params: {
        categoryId: number;
        modelId?: number;
        modificationId?: number;
        makeId?: number;
        warehouseId?: number;
    }): Promise<{
        id: number;
        name: string;
    }[]>;
    getProductDetailsBySku(sku: string, lang: 'ru' | 'en' | 'lv'): Promise<{
        attributes: any;
        photos: any;
        manufacturer_name: any;
        stock: any;
        oeNumbers: any;
        compatibility: any;
        equivalentsData: any;
        id: number;
        name: string;
        sku: string;
        category_id: number;
        manufacturer_id: number;
    } | null>;
    searchBySku(skuFragment: string, page?: number, limit?: number): Promise<{
        result: any;
        totalCount: any;
        warehouseDetails: never[];
    }>;
    searchByOem(oemNumber: string, page?: number, limit?: number): Promise<{
        result: any;
        totalCount: any;
        warehouseDetails: never[];
    }>;
}
