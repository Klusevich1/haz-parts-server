import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from 'src/entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(
    @Query('locale') locale?: string,
    @Query('modificationId') modificationId?: number,
  ): Promise<Category[]> {
    if (modificationId) {
      return this.categoriesService.findByModification(modificationId);
    }
    return this.categoriesService.getAllCategories();
  }

  @Get(':slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get('group-by-id/:groupId')
  async getGroupCategory(@Param('groupId') groupId: number) {
    return this.categoriesService.findGroupByCategoryId(groupId);
  }

  // @Get()
  // async getAll() {
  //   return this.categoriesService.getAllCategories();
  //

  // @Post('import-from-file')
  // async importFromFile(@Query('locale') locale: string = 'en') {
  //   return this.categoriesService.loadAllFromFile(locale);
  // }
}
