import { CarInfoService } from './car-info.service';
export declare class CarInfoController {
    private readonly carInfoService;
    constructor(carInfoService: CarInfoService);
    getAllBrands(): Promise<import("./entities/car-brand.entity").CarBrand[]>;
    getAllBrandsNames(): Promise<{
        name: string;
    }[]>;
    getModelsByBrand(brand: string): Promise<import("./entities/car-model.entity").CarModel[]>;
    importCarData(): Promise<{
        message: string;
        count: any;
    }>;
}
