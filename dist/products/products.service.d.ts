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
    getProductsByFilters(filters: {
        categorySlug?: string;
        brandSlug?: string;
        modelSlug?: string;
        modificationSlug?: string;
    }): Promise<Product[]>;
}
