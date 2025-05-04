import { Repository } from 'typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { CarModel } from './entities/car-model.entity';
export declare class CarInfoService {
    private readonly carBrandRepository;
    constructor(carBrandRepository: Repository<CarBrand>);
    getAllBrands(): Promise<CarBrand[]>;
    getAllBrandsNames(): Promise<{
        name: string;
    }[]>;
    getModelsByBrandName(brandName: string): Promise<CarModel[]>;
    loadCarDataFromFile(): Promise<{
        message: string;
        count: any;
    }>;
}
