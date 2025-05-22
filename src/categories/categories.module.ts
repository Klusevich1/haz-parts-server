import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategoryLv, CategoryRu } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryLv, CategoryRu])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
