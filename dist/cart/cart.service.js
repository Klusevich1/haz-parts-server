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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const typeorm_2 = require("typeorm");
let CartService = class CartService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getCart(userId) {
        return this.repo.find({ where: { userId } });
    }
    async addOrUpdateItem(userId, dto) {
        const existing = await this.repo.findOne({
            where: { userId: userId, productId: dto.productId, hub: dto.hub },
        });
        if (existing) {
            existing.quantity += dto.quantity;
            return this.repo.save(existing);
        }
        const totalItems = await this.repo.count({ where: { userId } });
        if (totalItems >= 100) {
            throw new common_1.BadRequestException('Превышено максимальное количество товаров в корзине');
        }
        const newItem = this.repo.create({ ...dto, userId });
        return this.repo.save(newItem);
    }
    async updateItemQuantity(userId, productId, hub, dto) {
        const item = await this.repo.findOne({
            where: { userId: userId, productId: productId, hub },
        });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        item.quantity = Math.min(Math.max(dto.quantity, 1), item.availability);
        return this.repo.save(item);
    }
    async removeItem(userId, productId, hub) {
        return this.repo.delete({ userId: userId, productId: productId, hub });
    }
    async clearCart(userId) {
        return this.repo.delete({ userId: userId });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map