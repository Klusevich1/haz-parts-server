import { CategoriesService } from './categories.service';
import { Category } from 'src/entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(locale?: string, modificationId?: number, lang?: 'ru' | 'en' | 'lv'): Promise<Category[]>;
    getCategoryBySlug(slug: string, lang?: 'ru' | 'en' | 'lv'): Promise<Category | null>;
    getGroupCategory(groupId: number, lang?: 'ru' | 'en' | 'lv'): Promise<{
        group_name: string;
        categories: Category[];
    } | null>;
}
