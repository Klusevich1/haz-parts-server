import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Brand } from './product.entity';
import { Model } from './product.entity';
import { Modification } from './product.entity';
import { Category } from 'src/categories/category.entity';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    private brandRepository;
    private modelRepository;
    private modificationRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, brandRepository: Repository<Brand>, modelRepository: Repository<Model>, modificationRepository: Repository<Modification>);
    getCatalogProducts(params: {
        categoryId: number;
        modelId?: number;
        modificationId?: number;
        manufacturerId?: number;
        warehouseId?: number;
        makeId?: number;
        sortBy?: 'name' | 'price';
        sortDir?: 'ASC' | 'DESC';
        page?: number;
        limit?: number;
    }): Promise<any>;
    getProductDetailsBySku(sku: string): Promise<{
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
        category: Category;
        brands: Brand[];
        models: Model[];
        modifications: Modification[];
    } | null>;
    searchByArticle(articleId: number): Promise<any>;
    searchByOem(oemNumber: number): Promise<any>;
}
