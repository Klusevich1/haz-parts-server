import { User } from './user.entity';
export declare class Address {
    id: number;
    type: 'Physical' | 'Legal';
    country: string;
    city: string;
    street: string;
    postcode: string;
    user: User;
}
