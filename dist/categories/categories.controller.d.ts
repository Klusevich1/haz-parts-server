import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(locale?: string): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category[]>;
    importFromFile(locale?: string): Promise<Category[]>;
}
