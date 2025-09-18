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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const create_cart_item_dto_1 = require("./dto/create-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(req) {
        return this.cartService.getCart(req.user.id);
    }
    addOrUpdateItem(req, dto) {
        return this.cartService.addOrUpdateItem(req.user.id, dto);
    }
    updateItemQuantity(req, productId, hub, dto) {
        return this.cartService.updateItemQuantity(req.user.id, Number(productId), hub, dto);
    }
    removeItem(req, productId, hub) {
        return this.cartService.removeItem(req.user.id, productId, hub);
    }
    clearCart(req) {
        return this.cartService.clearCart(req.user.id);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cart_item_dto_1.CreateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addOrUpdateItem", null);
__decorate([
    (0, common_1.Patch)(':productId/:hub'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Param)('hub')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItemQuantity", null);
__decorate([
    (0, common_1.Delete)(':productId/:hub'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Param)('hub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map