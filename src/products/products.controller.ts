// src/products/products.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getFilteredProducts(
    @Query('category') categorySlug?: string,
    @Query('brand') brandSlug?: string,
    @Query('model') modelSlug?: string,
    @Query('modification') modificationSlug?: string,
  ) {
    return this.productsService.getProductsByFilters({
      categorySlug,
      brandSlug,
      modelSlug,
      modificationSlug,
    });
  }
}