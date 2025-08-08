import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: {
        id: number;
    }): Promise<import("./entities/user.entity").User | null>;
    getUserAddresses(user: {
        id: number;
    }): Promise<import("./entities/adress.entity").Address[]>;
    getUserOrders(user: {
        id: number;
    }): Promise<import("../entities/order.entity").Order[]>;
    changePassword(user: {
        id: number;
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    addUserAddress(user: {
        id: number;
    }, dto: AddAddressDto): Promise<import("./entities/adress.entity").Address>;
    logout(token: string, res: Response): Promise<{
        ok: boolean;
    }>;
    updateProfile(user: {
        id: number;
    }, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
