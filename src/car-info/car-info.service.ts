import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CarModel } from './entities/car-model.entity';

@Injectable()
export class CarInfoService {
  constructor(
    @InjectRepository(CarBrand)
    private readonly carBrandRepository: Repository<CarBrand>,
  ) {}

  async getAllBrands(): Promise<CarBrand[]> {
    return this.carBrandRepository.find();
  }

  async getAllBrandsNames(): Promise<{ name: string }[]> {
    const raw = await this.carBrandRepository
      .createQueryBuilder('brand')
      .select('brand.name', 'name')
      .orderBy('brand.name', 'ASC')
      .getRawMany();

    return raw;
  }

  async getModelsByBrandName(brandName: string): Promise<CarModel[]> {
    const brand = await this.carBrandRepository.findOne({
      where: { name: brandName.toUpperCase() },
      relations: ['models'],
    });

    if (!brand) {
      throw new Error(`Бренд ${brandName} не найден`);
    }

    return brand.models;
  }

  async loadCarDataFromFile() {
    const filePath = join(process.cwd(), 'src', 'data', 'car_info.json');
    const carData = JSON.parse(readFileSync(filePath, 'utf8'));

    const results: any = [];

    for (const brand of carData) {
      const saved = await this.carBrandRepository.save(brand);
      results.push(saved);
    }

    return {
      message: 'Данные успешно загружены в базу',
      count: results.length,
    };
  }
}
