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
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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
        return this.generateToken(user.id);
    }
    async login(dto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        return this.generateToken(user.id);
    }
    async checkEmail(email) {
        const existing = await this.userService.findByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('Email уже используется');
        }
        return { available: true };
    }
    generateToken(id) {
        return {
            access_token: this.jwtService.sign({ sub: id }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map