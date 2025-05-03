import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category[]>;
}
