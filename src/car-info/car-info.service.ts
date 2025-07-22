import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Make } from 'src/entities/make.entity';
import { Model } from 'src/entities/model.entity';
import { ModelModification } from 'src/entities/model-modification.entity';

@Injectable()
export class CarInfoService {
  constructor(
    @InjectRepository(Make)
    private readonly makeRepository: Repository<Make>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(ModelModification)
    private readonly modificationRepository: Repository<ModelModification>,
  ) {}

  async getAllBrands() {
    return await this.makeRepository.query(
      `SELECT DISTINCT mk.id, mk.name, mk.logo_url, mk.slug
       FROM Makes mk
       JOIN Models mdl ON mdl.make_id = mk.id
       ORDER BY mk.name;
      `,
    );
  }

  async getModelsByMake(makeId: number) {
    return await this.modelRepository.query(
      `SELECT id, name, model_url, slug FROM Models WHERE make_id = ? ORDER BY name;`,
      [makeId],
    );
  }

  async getModificationsByModel(modelId: number) {
    return await this.modificationRepository.query(
      `SELECT id, name, power, year_from, year_to, slug
     FROM ModelModifications
     WHERE model_id = ?
     ORDER BY year_from;`,
      [modelId],
    );
  }

  // async getMakeIdBySlug(slug: string): Promise<number | null> {
  //   const result = await this.makeRepository.query(
  //     `SELECT id FROM Makes WHERE slug = ? LIMIT 1`,
  //     [slug],
  //   );
  //   return result[0]?.id || null;
  // }

  // async getModelIdBySlug(slug: string): Promise<number | null> {
  //   const result = await this.modelRepository.query(
  //     `SELECT id FROM Models WHERE slug = ? LIMIT 1`,
  //     [slug],
  //   );
  //   return result[0]?.id || null;
  // }

  // async getModificationIdBySlug(slug: string): Promise<number | null> {
  //   const result = await this.modificationRepository.query(
  //     `SELECT id FROM ModelModifications WHERE slug = ? LIMIT 1`,
  //     [slug],
  //   );
  //   return result[0]?.id || null;
  // }

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
