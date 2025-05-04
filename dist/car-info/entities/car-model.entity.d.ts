import { CarBrand } from './car-brand.entity';
import { CarModification } from './car-modification.entity';
export declare class CarModel {
    id: string;
    name: string;
    body: string;
    years: string;
    image: string;
    link: string;
    brand: CarBrand;
    modifications: CarModification[];
}
