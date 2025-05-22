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
let UserService = class UserService {
    userRepo;
    addressRepo;
    constructor(userRepo, addressRepo) {
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
    }
    findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    findById(id) {
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
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['addresses'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        return user.addresses;
    }
    async addAddress(userId, dto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const address = this.addressRepo.create({
            ...dto,
            user,
        });
        return this.addressRepo.save(address);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(adress_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map