import { CarModel } from './car-model.entity';
export declare class CarModification {
    id: string;
    modification: string;
    engine: {
        code: string;
        type: string;
        power_kw: string;
        power_hp: string;
    };
    production_years: string;
    drive_type: string;
    link: string;
    model: CarModel;
}
