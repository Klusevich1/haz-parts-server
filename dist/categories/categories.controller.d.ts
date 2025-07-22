import { CategoriesService } from './categories.service';
import { Category } from 'src/entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(locale?: string, modificationId?: number): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    getGroupCategory(groupId: number): Promise<{
        group_name: string;
        categories: Category[];
    } | null>;
}
