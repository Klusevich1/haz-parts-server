import { Repository } from 'typeorm';
import { Category, CategoryLv, CategoryRu } from './category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly categoryRepositoryRu;
    private readonly categoryRepositoryLv;
    constructor(categoryRepository: Repository<Category>, categoryRepositoryRu: Repository<CategoryRu>, categoryRepositoryLv: Repository<CategoryLv>);
    getAllCategories(): Promise<any>;
    findBySlug(slug: string): Promise<Category | null>;
    createCategory(data: {
        locale: string;
        category: string;
        subcategories: {
            name: string;
            slug: string;
        }[];
        image: string;
        slug: string;
    }): Promise<Category | CategoryRu | CategoryLv>;
    loadAllFromFile(locale: string): Promise<Category[]>;
}
