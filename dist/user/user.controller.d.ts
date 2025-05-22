import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAddressDto } from './dto/add-address.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: {
        userId: number;
    }): Promise<import("./entities/user.entity").User | null>;
    getUserAddresses(user: {
        userId: number;
    }): Promise<import("./entities/adress.entity").Address[]>;
    changePassword(user: {
        userId: number;
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    addUserAddress(user: {
        userId: number;
    }, dto: AddAddressDto): Promise<import("./entities/adress.entity").Address>;
    updateProfile(user: {
        userId: number;
    }, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
