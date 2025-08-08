import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly redisService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, redisService: RedisService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(oldRefreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    checkEmail(email: string, mode: 'login' | 'register' | 'forgot'): Promise<{
        available: boolean;
    }>;
    private generateTokenPair;
    generateResetToken(email: string): Promise<string>;
    resetPasswordByToken(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
