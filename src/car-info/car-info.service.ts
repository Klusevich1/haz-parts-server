import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CarModel } from './entities/car-model.entity';
import { Model, Modification } from 'src/products/product.entity';

@Injectable()
export class CarInfoService {
  constructor(
    @InjectRepository(CarBrand)
    private readonly makeRepository: Repository<CarBrand>,
    private readonly modelRepository: Repository<Model>,
    private readonly modificationRepository: Repository<Modification>,
  ) {}

  async getAllBrands() {
    return await this.makeRepository.query(
      `SELECT id, name, logo_url FROM Makes ORDER BY name;`,
    );
  }

  async getModelsByMake(makeId: number) {
    return await this.modelRepository.query(
      `SELECT id, name, model_url FROM Models WHERE make_id = ? ORDER BY name;`,
      [makeId],
    );
  }

  async getModificationsByModel(modelId: number) {
    return await this.modificationRepository.query(
      `SELECT id, name, power, year_from, year_to
     FROM ModelModifications
     WHERE model_id = ?
     ORDER BY year_from;`,
      [modelId],
    );
  }

  async loadCarDataFromFile() {
    const filePath = join(process.cwd(), 'src', 'data', 'car_info.json');
    const carData = JSON.parse(readFileSync(filePath, 'utf8'));

    const results: any = [];

    for (const brand of carData) {
      const saved = await this.makeRepository.save(brand);
      results.push(saved);
    }

    return {
      message: 'Данные успешно загружены в базу',
      count: results.length,
    };
  }
}
