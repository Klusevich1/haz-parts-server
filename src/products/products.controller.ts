// src/products/products.controller.ts
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('catalog')
  async getCatalogProducts(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('makeId') makeId: string,
    @Query('modelId') modelId: string,
    @Query('modificationId') modificationId: string,
    @Query('manufacturers') manufacturers: string,
    @Query('warehouses') warehouses: string,
    @Query('sortBy') sortBy: 'availability' | 'price' | '' = '',
    @Query('sortDir') sortDir: 'ASC' | 'DESC' = 'ASC',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number = 24,
  ) {
    const makeIdNum = makeId ? parseInt(makeId, 10) : undefined;
    const modelIdNum = modelId ? parseInt(modelId, 10) : undefined;
    const modificationIdNum = modificationId
      ? parseInt(modificationId, 10)
      : undefined;
    const manufacturerIds = manufacturers.length
      ? manufacturers?.split('~').map((id) => parseInt(id, 10))
      : [];
    const warehouseIds = warehouses.length
      ? warehouses?.split('~').map((id) => parseInt(id, 10))
      : [];

    return this.productsService.getCatalogProducts({
      categoryId,
      makeIdNum: makeIdNum ?? undefined,
      modelIdNum: modelIdNum ?? undefined,
      modificationIdNum: modificationIdNum ?? undefined,
      manufacturerIds,
      warehouseIds,
      sortBy,
      sortDir,
      page,
      limit,
    });
  }

  @Get('manufacturers')
  async getCatalogManufacturers(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('modificationId') modificationId?: number,
  ) {
    return this.productsService.getCatalogManufacturers({
      categoryId,
      modificationId: modificationId ? Number(modificationId) : undefined,
    });
  }

  @Get('warehouses')
  async getCatalogWarehouses(
    @Query('categoryId', ParseIntPipe) categoryId: number,
    @Query('modificationId') modificationId?: number,
  ) {
    return this.productsService.getCatalogWarehouses({
      categoryId,
      modificationId: modificationId ? Number(modificationId) : undefined,
    });
  }

  @Get('/searchBySku')
  async getArticleProduct(
    @Query('skuFragment') skuFragment: string,
    @Query('page') page = 1,
    @Query('limit') limit = 24,
  ) {
    return this.productsService.searchBySku(skuFragment, page, limit);
  }

  @Get('/searchByOem')
  async getOemProduct(
    @Query('oemNumber') oemNumber: string,
    @Query('page') page = 1,
    @Query('limit') limit = 24,
  ) {
    return this.productsService.searchByOem(oemNumber, page, limit);
  }

  @Get(':sku')
  async getProduct(
    @Param('sku') sku: string,
    @Query('lang') lang: 'ru' | 'en' | 'lv' = 'en',
  ) {
    return this.productsService.getProductDetailsBySku(sku, lang);
  }

  @Get('product/equivalents')
  async getEquivalentProducts(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('includeOriginalSku') includeOriginalSku?: string, // 'true' | 'false'
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number = 24,
  ) {
    const includeOriginal =
      typeof includeOriginalSku === 'string'
        ? ['1', 'true', 'yes', 'y', 'on'].includes(
            includeOriginalSku.toLowerCase(),
          )
        : true; // по умолчанию включаем исходный SKU

    return this.productsService.getEquivalentProducts({
      productId,
      includeOriginalSku: includeOriginal,
      page,
      limit,
    });
  }
}
