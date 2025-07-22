import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAddressDto } from './dto/add-address.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: {
        id: number;
    }): Promise<import("./entities/user.entity").User | null>;
    getUserAddresses(user: {
        id: number;
    }): Promise<import("./entities/adress.entity").Address[]>;
    changePassword(user: {
        id: number;
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    addUserAddress(user: {
        id: number;
    }, dto: AddAddressDto): Promise<import("./entities/adress.entity").Address>;
    updateProfile(user: {
        id: number;
    }, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
