import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    getAllCategories(): Promise<any>;
    findByModification(modificationId: number): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category | null>;
    findGroupByCategoryId(groupId: number): Promise<{
        group_name: string;
        categories: Category[];
    } | null>;
}
