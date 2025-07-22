import { Make } from 'src/entities/make.entity';
import { Manufacturer } from 'src/entities/manufacturer.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
import { Model } from 'src/entities/model.entity';
import { Warehouse } from 'src/entities/warehouse.entity';
import { Repository } from 'typeorm';
export declare class IdsService {
    private makeRepository;
    private modelRepository;
    private modificationRepository;
    private manufacturerRepository;
    private warehouseRepository;
    constructor(makeRepository: Repository<Make>, modelRepository: Repository<Model>, modificationRepository: Repository<ModelModification>, manufacturerRepository: Repository<Manufacturer>, warehouseRepository: Repository<Warehouse>);
    getManufacturerIds(slugs: string[]): Promise<number[]>;
    getWarehouseIds(slugs: string[]): Promise<number[]>;
    getMakeIdBySlug(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
    getModelIdBySlug(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
    getModificationIdBySlug(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
}
