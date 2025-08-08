import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    getAllCategories(lang: 'ru' | 'en' | 'lv'): Promise<any>;
    findByModification(modificationId: number, lang: 'ru' | 'en' | 'lv'): Promise<Category[]>;
    findBySlug(slug: string, lang: 'ru' | 'en' | 'lv'): Promise<Category | null>;
    findGroupByCategoryId(groupId: number, lang: 'ru' | 'en' | 'lv'): Promise<{
        group_name: string;
        categories: Category[];
    } | null>;
}
