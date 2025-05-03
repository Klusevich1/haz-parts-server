import { Category } from 'src/categories/category.entity';
export declare class Brand {
    id: string;
    slug: string;
    name: string;
}
export declare class Model {
    id: string;
    slug: string;
    name: string;
}
export declare class Modification {
    id: string;
    slug: string;
    name: string;
    engineSize: string;
}
export declare class Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    description: string;
    category: Category;
    brands: Brand[];
    models: Model[];
    modifications: Modification[];
}
