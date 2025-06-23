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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async getCatalogProducts(categoryId, modelId, modificationId, manufacturerId, makeId, warehouseId, sortBy = 'name', sortDir = 'ASC', page = 1, limit = 24) {
        return this.productsService.getCatalogProducts({
            categoryId,
            modelId: modelId ?? undefined,
            modificationId: modificationId ?? undefined,
            manufacturerId: manufacturerId ?? undefined,
            makeId: makeId ?? undefined,
            warehouseId: warehouseId ?? undefined,
            sortBy,
            sortDir,
            page,
            limit,
        });
    }
    async getProduct(sku) {
        return this.productsService.getProductDetailsBySku(sku);
    }
    async getArticleProduct(articleId) {
        return this.productsService.searchByArticle(articleId);
    }
    async getOemProduct(articleId) {
        return this.productsService.searchByOem(articleId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('catalog'),
    __param(0, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('modelId', new common_1.DefaultValuePipe(null), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('modificationId', new common_1.DefaultValuePipe(null), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('manufacturerId', new common_1.DefaultValuePipe(null), common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('makeId', new common_1.DefaultValuePipe(null), common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('warehouseId', new common_1.DefaultValuePipe(null), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortDir')),
    __param(8, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(9, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(24), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object, Object, Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCatalogProducts", null);
__decorate([
    (0, common_1.Get)(':sku'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)('/searchByArticle/:articleId'),
    __param(0, (0, common_1.Query)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getArticleProduct", null);
__decorate([
    (0, common_1.Get)('/searchByOem/:articleId'),
    __param(0, (0, common_1.Query)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getOemProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map