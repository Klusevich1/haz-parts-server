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
}
