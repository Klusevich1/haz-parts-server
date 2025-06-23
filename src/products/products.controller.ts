// src/products/products.controller.ts
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('catalog')
  async getCatalogProducts(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('modelId', new DefaultValuePipe(null), ParseIntPipe)
    modelId: number | null,
    @Query('modificationId', new DefaultValuePipe(null), ParseIntPipe)
    modificationId: number | null,
    @Query('manufacturerId', new DefaultValuePipe(null), ParseIntPipe)
    manufacturerId: number | null,
    @Query('makeId', new DefaultValuePipe(null), ParseIntPipe)
    makeId: number | null,
    @Query('warehouseId', new DefaultValuePipe(null), ParseIntPipe)
    warehouseId: number | null,
    @Query('sortBy') sortBy: 'name' | 'price' = 'name',
    @Query('sortDir') sortDir: 'ASC' | 'DESC' = 'ASC',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number = 24,
  ) {
    return this.productsService.getCatalogProducts({
      categoryId,
      modelId: modelId ?? undefined,
      modificationId: modificationId ?? undefined,
      manufacturerId: manufacturerId ?? undefined,
      makeId: makeId ?? undefined,
      warehouseId: warehouseId ?? undefined,
      sortBy,
      sortDir,
      page,
      limit,
    });
  }

  @Get(':sku')
  async getProduct(@Param('sku') sku: string) {
    return this.productsService.getProductDetailsBySku(sku);
  }

  @Get('/searchByArticle/:articleId')
  async getArticleProduct(@Query('articleId') articleId: number) {
    return this.productsService.searchByArticle(articleId);
  }

  @Get('/searchByOem/:articleId')
  async getOemProduct(@Query('articleId') articleId: number) {
    return this.productsService.searchByOem(articleId);
  }
}
