// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryLv, CategoryRu } from './category.entity';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(CategoryRu)
    private readonly categoryRepositoryRu: Repository<CategoryRu>,

    @InjectRepository(CategoryLv)
    private readonly categoryRepositoryLv: Repository<CategoryLv>,
  ) {}

  async getAllCategories(locale: string): Promise<Category[]> {
    if (locale === 'lv') {
      return this.categoryRepositoryLv.find();
    } else if (locale === 'ru') {
      return this.categoryRepositoryRu.find();
    } else {
      return this.categoryRepository.find();
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { slug },
        // relations: ['subcategories'],
      });

      if (!category) {
        return null;
      }

      return {
        id: category.id,
        category: category.category,
        subcategories: category.subcategories,
        image: category.image,
        slug: category.slug,
      };
    } catch (error) {
      console.error('Error finding category by slug:', error);
      throw error;
    }
  }

  async createCategory(data: {
    locale: string;
    category: string;
    subcategories: { name: string; slug: string }[];
    image: string;
    slug: string;
  }) {
    if (data.locale === 'ru') {
      const category = this.categoryRepositoryRu.create({
        category: data.category,
        subcategories: data.subcategories,
        image: data.image,
        slug: data.slug,
      });
      return this.categoryRepositoryRu.save(category);
    } else if (data.locale === 'lv') {
      const category = this.categoryRepositoryLv.create({
        category: data.category,
        subcategories: data.subcategories,
        image: data.image,
        slug: data.slug,
      });
      return this.categoryRepositoryLv.save(category);
    } else {
      const category = this.categoryRepository.create({
        category: data.category,
        subcategories: data.subcategories,
        image: data.image,
        slug: data.slug,
      });
      return this.categoryRepository.save(category);
    }
  }

  async loadAllFromFile(locale: string) {
    let jsonData;
    let repository: Repository<Category | CategoryRu | CategoryLv>;

    if (locale === 'lv') {
      const filePath = join(
        process.cwd(),
        'src',
        'data',
        'final_all_categoriesLV.json',
      );
      jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
      repository = this.categoryRepositoryLv;
    } else if (locale === 'ru') {
      const filePath = join(
        process.cwd(),
        'src',
        'data',
        'final_all_categoriesRU.json',
      );
      jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
      repository = this.categoryRepositoryRu;
    } else if (locale === 'en') {
      const filePath = join(
        process.cwd(),
        'src',
        'data',
        'final_all_categories.json',
      );
      jsonData = JSON.parse(readFileSync(filePath, 'utf8'));
      repository = this.categoryRepository;
    }

    // Очистка таблицы перед вставкой новых данных
    await repository.clear();

    const results: Category[] = [];
    for (const item of jsonData) {
      const saved = await this.createCategory({
        locale: locale,
        category: item.category,
        subcategories: item.subcategories,
        image: item.image,
        slug: item.slug,
      });
      results.push(saved);
    }

    return results;
  }

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
}
