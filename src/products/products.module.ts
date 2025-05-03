import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Model, Modification, Product } from './product.entity';
import { Category } from 'src/categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Brand, Model, Modification, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
