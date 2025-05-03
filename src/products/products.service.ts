// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from './product.entity';
import { Brand } from './product.entity';
import { Model } from './product.entity';
import { Modification } from './product.entity';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(Modification)
    private modificationRepository: Repository<Modification>,
  ) {}

  async getProductsByFilters(filters: {
    categorySlug?: string;
    brandSlug?: string;
    modelSlug?: string;
    modificationSlug?: string;
  }) {
    const query = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.brands', 'brand')
    .leftJoinAndSelect('product.models', 'model')
    .leftJoinAndSelect('product.modifications', 'modification');

  if (filters.categorySlug) {
    query.andWhere('category.slug = :categorySlug', { categorySlug: filters.categorySlug });
  }

  if (filters.brandSlug) {
    query.andWhere('brand.slug = :brandSlug', { brandSlug: filters.brandSlug });
  }

  if (filters.modelSlug) {
    query.andWhere('model.slug = :modelSlug', { modelSlug: filters.modelSlug });
  }

  if (filters.modificationSlug) {
    query.andWhere('modification.slug = :modificationSlug', { 
      modificationSlug: filters.modificationSlug 
    });
  }

  return query.getMany();
  }
}