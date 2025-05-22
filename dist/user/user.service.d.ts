import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/adress.entity';
import { AddAddressDto } from './dto/add-address.dto';
export declare class UserService {
    private readonly userRepo;
    private readonly addressRepo;
    constructor(userRepo: Repository<User>, addressRepo: Repository<Address>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    save(user: User): Promise<User>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updateProfile(userId: number, dto: UpdateUserDto): Promise<User>;
    getAddresses(userId: number): Promise<Address[]>;
    addAddress(userId: number, dto: AddAddressDto): Promise<Address>;
}
