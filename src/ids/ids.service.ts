import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Make } from 'src/entities/make.entity';
import { Manufacturer } from 'src/entities/manufacturer.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
import { Model } from 'src/entities/model.entity';
import { Warehouse } from 'src/entities/warehouse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdsService {
  constructor(
    @InjectRepository(Make)
    private makeRepository: Repository<Make>,
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(ModelModification)
    private modificationRepository: Repository<ModelModification>,
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async getManufacturerIds(slugs: string[]): Promise<number[]> {
    if (!slugs.length) return [];

    const result = await this.manufacturerRepository.query(
      `SELECT id FROM Manufacturers WHERE slug IN (?)`,
      [slugs],
    );

    return result.map((row: { id: number }) => row.id);
  }

  async getWarehouseIds(slugs: string[]): Promise<number[]> {
    if (!slugs.length) return [];

    const result = await this.warehouseRepository.query(
      `SELECT id FROM Warehouses WHERE slug IN (?)`,
      [slugs],
    );

    return result.map((row: { id: number }) => row.id);
  }

  async getMakeIdBySlug(
    slug: string,
  ): Promise<{ id: number | null; name: string | null }> {
    const result = await this.makeRepository.query(
      `SELECT id, name FROM Makes WHERE slug = ? LIMIT 1`,
      [slug],
    );
    if (!result.length) {
      return { id: null, name: null };
    }

    return {
      id: result[0].id,
      name: result[0].name,
    };
  }

  async getModelIdBySlug(
    slug: string,
  ): Promise<{ id: number | null; name: string | null }> {
    const result = await this.modelRepository.query(
      `SELECT id, name FROM Models WHERE slug = ? LIMIT 1`,
      [slug],
    );
    if (!result.length) {
      return { id: null, name: null };
    }

    return {
      id: result[0].id,
      name: result[0].name,
    };
  }

  async getModificationIdBySlug(
    slug: string,
  ): Promise<{ id: number | null; name: string | null }> {
    const result = await this.modificationRepository.query(
      `SELECT id, name FROM ModelModifications WHERE slug = ? LIMIT 1`,
      [slug],
    );
    if (!result.length) {
      return { id: null, name: null };
    }

    return {
      id: result[0].id,
      name: result[0].name,
    };
  }
}
