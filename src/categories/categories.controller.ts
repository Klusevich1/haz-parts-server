import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(@Query('locale') locale: string = 'en'): Promise<Category[]> {
    return this.categoriesService.getAllCategories(locale);
  }

  @Get('bySlug')
  async getCategoryBySlug(@Query('slug') slug: string) {
    if (!slug) {
      throw new HttpException(
        'Slug parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const category = await this.categoriesService.findBySlug(slug);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return [category];
  }

  @Post('import-from-file')
  async importFromFile(@Query('locale') locale: string = 'en') {
    return this.categoriesService.loadAllFromFile(locale);
  }
}
