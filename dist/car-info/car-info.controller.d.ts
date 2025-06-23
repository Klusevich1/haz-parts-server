import { CarInfoService } from './car-info.service';
export declare class CarInfoController {
    private readonly carInfoService;
    constructor(carInfoService: CarInfoService);
    getAllBrands(): Promise<any>;
    getByMake(makeId: number): Promise<any>;
    getByModel(modelId: number): Promise<any>;
    importCarData(): Promise<{
        message: string;
        count: any;
    }>;
}
