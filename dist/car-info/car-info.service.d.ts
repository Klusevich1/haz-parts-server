import { Repository } from 'typeorm';
import { Make } from 'src/entities/make.entity';
import { Model } from 'src/entities/model.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
export declare class CarInfoService {
    private readonly makeRepository;
    private readonly modelRepository;
    private readonly modificationRepository;
    constructor(makeRepository: Repository<Make>, modelRepository: Repository<Model>, modificationRepository: Repository<ModelModification>);
    getAllBrands(): Promise<any>;
    getModelsByMake(makeId: number): Promise<any>;
    getModificationsByModel(modelId: number): Promise<any>;
}
