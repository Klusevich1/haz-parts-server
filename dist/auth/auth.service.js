"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
const crypto_1 = require("crypto");
const redis_service_1 = require("../redis/redis.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    userService;
    jwtService;
    redisService;
    configService;
    constructor(userService, jwtService, redisService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email уже используется');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userService.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            surname: dto.surname,
        });
        return this.generateTokenPair(user.id);
    }
    async login(dto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        return this.generateTokenPair(user.id);
    }
    async refreshToken(oldRefreshToken) {
        try {
            console.log(oldRefreshToken);
            const payload = this.jwtService.verify(oldRefreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const exists = await this.redisService.get(`refresh:${payload.jti}`);
            if (!exists)
                throw new common_1.UnauthorizedException('Токен устарел или отозван');
            return this.generateTokenPair(payload.sub);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Неверный или просроченный токен');
        }
    }
    async checkEmail(email, mode) {
        const existing = await this.userService.findByEmail(email);
        if (mode === 'register') {
            if (existing) {
                throw new common_1.ConflictException('Email уже используется');
            }
        }
        else if (mode === 'forgot') {
            if (!existing) {
                throw new common_1.ConflictException('Аккаунта с таким Email не существует');
            }
        }
        return { available: true };
    }
    async generateTokenPair(userId) {
        const jti = (0, crypto_1.randomUUID)();
        const access_token = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign({ sub: userId, jti }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
        await this.redisService.set(`refresh:${jti}`, userId.toString(), 60 * 60 * 24 * 7);
        return { access_token, refresh_token };
    }
    async generateResetToken(email) {
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        return this.jwtService.sign({
            sub: user.id,
            email,
            jti: (0, crypto_1.randomUUID)(),
        }, {
            expiresIn: '10m',
            secret: process.env.JWT_RESET_SECRET,
        });
    }
    async resetPasswordByToken(token, newPassword) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_RESET_SECRET,
            });
            const user = await this.userService.findById(payload.sub);
            if (!user)
                throw new common_1.NotFoundException('Пользователь не найден');
            const hash = await bcrypt.hash(newPassword, 10);
            user.passwordHash = hash;
            await this.userService.save(user);
            return { message: 'Пароль успешно обновлён' };
        }
        catch (e) {
            throw new common_1.BadRequestException('Недействительный или истёкший токен');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map