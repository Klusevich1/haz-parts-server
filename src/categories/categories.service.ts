// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
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

  // async createCategory(data: {
  //   category: string;
  //   subcategories: { name: string; slug: string }[];
  //   image: string;
  //   slug: string;
  // }) {
  //   const category = this.categoryRepository.create({
  //     category: data.category,
  //     subcategories: data.subcategories,
  //     image: data.image,
  //     slug: data.slug,
  //   });

  //   return this.categoryRepository.save(category);
  // }

  // async loadAllFromFile() {
  //   const filePath = join(
  //     process.cwd(),
  //     'src',
  //     'data',
  //     'final_all_categories.json',
  //   );
  //   const jsonData = JSON.parse(readFileSync(filePath, 'utf8'));

  //   const results: Category[] = [];
  //   for (const item of jsonData) {
  //     const saved = await this.createCategory({
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
