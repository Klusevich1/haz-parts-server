// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(lang: 'ru' | 'en' | 'lv') {
    const validLangs = ['ru', 'en', 'lv'];
    const columnSuffix = validLangs.includes(lang) ? lang : 'ru';

    return await this.categoryRepository.query(
      `
    SELECT 
      c.id, 
      c.name_${columnSuffix} AS name, 
      c.slug, 
      c.group_id, 
      cg.name_${columnSuffix} AS group_name
    FROM Categories c
    LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
    ORDER BY cg.name_${columnSuffix}, c.name_${columnSuffix};
    `,
    );
  }

  async findByModification(
    modificationId: number,
    lang: 'ru' | 'en' | 'lv',
  ): Promise<Category[]> {
    const validLangs = ['ru', 'en', 'lv'];
    const columnSuffix = validLangs.includes(lang) ? lang : 'ru';

    return this.categoryRepository.query(
      `
    SELECT DISTINCT 
      c.id,
      c.slug,
      c.group_id,
      c.name_${columnSuffix} AS name,
      cg.name_${columnSuffix} AS group_name
    FROM Categories c
    JOIN Products p ON p.category_id = c.id
    JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id
    LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
    WHERE pvc.modification_id = ?
    `,
      [modificationId],
    );
  }

  // async getAllCategories(locale: string): Promise<Category[]> {
  //   return this.categoryRepository.find();
  // }

  async findBySlug(
    slug: string,
    lang: 'ru' | 'en' | 'lv',
  ): Promise<Category | null> {
    try {
      const validLangs = ['ru', 'en', 'lv'];
      const columnSuffix = validLangs.includes(lang) ? lang : 'en';

      const result = await this.categoryRepository.query(
        `
      SELECT c.id, c.name_${columnSuffix} AS name, c.slug, c.group_id, cg.name_${columnSuffix} AS group_name
      FROM Categories c
      LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
      WHERE c.slug = ?
      LIMIT 1
      `,
        [slug],
      );

      if (!result || result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      console.error('Error finding category by slug:', error);
      throw error;
    }
  }

  async findGroupByCategoryId(
    groupId: number,
    lang: 'ru' | 'en' | 'lv',
  ): Promise<{ group_name: string; categories: Category[] } | null> {
    try {
      const validLangs = ['ru', 'en', 'lv'];
      const columnSuffix = validLangs.includes(lang) ? lang : 'en';
      const categories = await this.categoryRepository.query(
        `
      SELECT c.id, c.name_${columnSuffix} AS name, c.slug, c.group_id, cg.name_${columnSuffix} AS group_name
      FROM Categories c
      LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
      WHERE c.group_id = ?
      ORDER BY c.name_${columnSuffix}
      `,
        [groupId],
      );

      return {
        group_name: categories.group_name,
        categories,
      };
    } catch (error) {
      console.error('Error in findGroupByCategorySlug:', error);
      throw error;
    }
  }
}

// async createCategory(data: {
//   locale: string;
//   category: string;
//   subcategories: { name: string; slug: string }[];
//   image: string;
//   slug: string;
// }) {
//   if (data.locale === 'ru') {
//     const category = this.categoryRepositoryRu.create({
//       category: data.category,
//       subcategories: data.subcategories,
//       image: data.image,
//       slug: data.slug,
//     });
//     return this.categoryRepositoryRu.save(category);
//   } else if (data.locale === 'lv') {
//     const category = this.categoryRepositoryLv.create({
//       category: data.category,
//       subcategories: data.subcategories,
//       image: data.image,
//       slug: data.slug,
//     });
//     return this.categoryRepositoryLv.save(category);
//   } else {
//     const category = this.categoryRepository.create({
//       name: data.category,
//       subcategories: data.subcategories,
//       image: data.image,
//       slug: data.slug,
//     });
//     return this.categoryRepository.save(category);
//   }
// }

// async loadAllFromFile(locale: string) {
//   let jsonData;
//   let repository: Repository<Category | CategoryRu | CategoryLv>;

//   if (locale === 'lv') {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categoriesLV.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//     repository = this.categoryRepositoryLv;
//   } else if (locale === 'ru') {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categoriesRU.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//     repository = this.categoryRepositoryRu;
//   } else {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categories.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//     repository = this.categoryRepository;
//   }

//   // Очистка таблицы перед вставкой новых данных
//   await repository.clear();

//   const results: Category[] = [];
//   for (const item of jsonData) {
//     const saved = await this.createCategory({
//       locale: locale,
//       category: item.category,
//       subcategories: item.subcategories,
//       image: item.image,
//       slug: item.slug,
//     });
//     results.push(saved);
//   }

//   return results;
// }

// async loadAllFromFile(locale: string) {
//   let jsonData;
//   if (locale === 'lv') {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categoriesLV.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//   } else if (locale === 'ru') {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categoriesRU.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//   } else {
//     const filePath = join(
//       process.cwd(),
//       'src',
//       'data',
//       'final_all_categories.json',
//     );
//     jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
//   }

//   const results: Category[] = [];
//   for (const item of jsonData) {
//     const saved = await this.createCategory({
//       locale: locale,
//       category: item.category,
//       subcategories: item.subcategories,
//       image: item.image,
//       slug: item.slug,
//     });
//     results.push(saved);
//   }

//   return results;
// }
