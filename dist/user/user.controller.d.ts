import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: {
        userId: number;
    }): Promise<import("./entities/user.entity").User | null>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
