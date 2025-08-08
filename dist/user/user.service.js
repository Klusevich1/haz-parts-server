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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const adress_entity_1 = require("./entities/adress.entity");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
let UserService = class UserService {
    jwtService;
    redisService;
    userRepo;
    addressRepo;
    constructor(jwtService, redisService, userRepo, addressRepo) {
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
    }
    findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    findById(id) {
        console.log(id);
        return this.userRepo.findOne({ where: { id } });
    }
    create(user) {
        return this.userRepo.save(user);
    }
    save(user) {
        return this.userRepo.save(user);
    }
    async changePassword(userId, dto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('Пользователь не найден');
        }
        const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.BadRequestException('Текущий пароль неверен');
        }
        const newHash = await bcrypt.hash(dto.newPassword, 10);
        user.passwordHash = newHash;
        await this.save(user);
        return { message: 'Пароль успешно изменён' };
    }
    async updateProfile(userId, dto) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException();
        Object.assign(user, dto);
        return this.save(user);
    }
    async getAddresses(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const addresses = await this.userRepo.query(`SELECT * FROM Address WHERE user_id = ?`, [userId]);
        return addresses;
    }
    async getOrders(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const orders = await this.userRepo.query(`SELECT * FROM Orders WHERE user_id = ?`, [userId]);
        return orders;
    }
    async addAddress(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const addressCount = await this.addressRepo.count({
            where: { user: { id: userId } },
        });
        if (addressCount >= 15) {
            throw new common_1.BadRequestException('Превышено количество адресов (макс. 15)');
        }
        const address = this.addressRepo.create({
            ...dto,
            user,
        });
        return this.addressRepo.save(address);
    }
    async logout(refreshToken) {
        const payload = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });
        await this.redisService.del(`refresh:${payload.jti}`);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(adress_entity_1.Address)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map