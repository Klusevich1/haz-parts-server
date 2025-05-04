import { Repository } from 'typeorm';
import { Category } from './category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    getAllCategories(): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category | null>;
    createCategory(data: {
        category: string;
        subcategories: {
            name: string;
            slug: string;
        }[];
        image: string;
        slug: string;
    }): Promise<Category>;
    loadAllFromFile(): Promise<Category[]>;
}
