import { Address } from './adress.entity';
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    surname: string;
    default_address: string;
    default_pm: string;
    default_dm: string;
    addresses: Address[];
    createdAt: Date;
}
