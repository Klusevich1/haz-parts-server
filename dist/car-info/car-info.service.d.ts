import { Repository } from 'typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { Model, Modification } from 'src/products/product.entity';
export declare class CarInfoService {
    private readonly makeRepository;
    private readonly modelRepository;
    private readonly modificationRepository;
    constructor(makeRepository: Repository<CarBrand>, modelRepository: Repository<Model>, modificationRepository: Repository<Modification>);
    getAllBrands(): Promise<any>;
    getModelsByMake(makeId: number): Promise<any>;
    getModificationsByModel(modelId: number): Promise<any>;
    loadCarDataFromFile(): Promise<{
        message: string;
        count: any;
    }>;
}
