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

  async getCatalogProducts(params: {
    categoryId: number;
    modelId?: number;
    modificationId?: number;
    manufacturerId?: number;
    warehouseId?: number;
    makeId?: number;
    sortBy?: 'name' | 'price';
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }) {
    const {
      categoryId,
      modelId,
      modificationId,
      manufacturerId,
      warehouseId,
      makeId,
      sortBy = 'name',
      sortDir = 'ASC',
      page = 1,
      limit = 24,
    } = params;

    const offset = (page - 1) * limit;

    const result = await this.productRepository.query(
      `
    SELECT DISTINCT p.id, p.name, p.sku
    FROM Products p
    JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id
    JOIN ModelModifications mm ON mm.id = pvc.modification_id
    JOIN Models m ON m.id = mm.model_id
    JOIN Makes mk ON mk.id = m.make_id
    JOIN ProductStock ps ON ps.product_id = p.id
    JOIN Warehouses w ON w.id = ps.warehouse_id
    WHERE p.category_id = ?
      AND (? IS NULL OR m.id = ?)
      AND (? IS NULL OR mm.id = ?)
      AND (? IS NULL OR p.manufacturer_id = ?)
      AND (? IS NULL OR mk.id = ?)
      AND (? IS NULL OR w.id = ?)
    ORDER BY ${sortBy === 'price' ? 'ps.price' : 'p.name'} ${sortDir}
    LIMIT ? OFFSET ?
    `,
      [
        categoryId,
        modelId ?? null,
        modelId ?? null,
        modificationId ?? null,
        modificationId ?? null,
        manufacturerId ?? null,
        manufacturerId ?? null,
        makeId ?? null,
        makeId ?? null,
        warehouseId ?? null,
        warehouseId ?? null,
        limit,
        offset,
      ],
    );

    return result;
  }

  async getProductDetailsBySku(sku: string) {
    const product = await this.productRepository.findOne({
      where: { sku },
    });

    if (!product) return null;

    const productId = product.id;

    const [attributes, photos, stock, oeNumbers, compatibility] =
      await Promise.all([
        this.productRepository.query(
          `SELECT name, value FROM ProductAttributes WHERE product_id = ?`,
          [productId],
        ),
        this.productRepository.query(
          `SELECT photo_url, is_main FROM ProductPhotos WHERE product_id = ?`,
          [productId],
        ),
        this.productRepository.query(
          `SELECT w.name AS warehouse, ps.quantity, ps.price, ps.delivery_time, ps.min_order_quantity, ps.returnable
       FROM ProductStock ps
       JOIN Warehouses w ON w.id = ps.warehouse_id
       WHERE ps.product_id = ?`,
          [productId],
        ),
        this.productRepository.query(
          `SELECT mk.name AS make, po.oe_number
       FROM ProductOENumbers po
       JOIN Makes mk ON mk.id = po.make_id
       WHERE po.product_id = ?`,
          [productId],
        ),
        this.productRepository.query(
          `SELECT mk.name AS make, mdl.name AS model, mm.name AS modification, mm.power, mm.year_from, mm.year_to
       FROM ProductVehicleCompatibility pvc
       JOIN ModelModifications mm ON mm.id = pvc.modification_id
       JOIN Models mdl ON mdl.id = mm.model_id
       JOIN Makes mk ON mk.id = mdl.make_id
       WHERE pvc.product_id = ?`,
          [productId],
        ),
      ]);

    return {
      ...product,
      attributes,
      photos,
      stock,
      oeNumbers,
      compatibility,
    };
  }

  async searchByArticle(articleId: number) {
    return await this.productRepository.query(
      `SELECT id, name, sku FROM Products WHERE sku = ?`,
      [articleId],
    );
  }

  async searchByOem(oemNumber: number) {
    const results = await this.productRepository.query(
      `SELECT p.id, p.name, p.sku
     FROM ProductOENumbers po
     JOIN Products p ON p.id = po.product_id
     WHERE po.oe_number REGEXP CONCAT('(^|,\\s*)', ?, '(\\s*,|$)')`,
      [oemNumber],
    );

    return results;
  }
}
