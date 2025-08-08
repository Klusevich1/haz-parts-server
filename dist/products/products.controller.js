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
    async getCatalogProducts(categoryId, makeId, modelId, modificationId, manufacturers, warehouses, sortBy = '', sortDir = 'ASC', page = 1, limit = 24) {
        const makeIdNum = makeId ? parseInt(makeId, 10) : undefined;
        const modelIdNum = modelId ? parseInt(modelId, 10) : undefined;
        const modificationIdNum = modificationId
            ? parseInt(modificationId, 10)
            : undefined;
        const manufacturerIds = manufacturers.length
            ? manufacturers?.split('~').map((id) => parseInt(id, 10))
            : [];
        const warehouseIds = warehouses.length
            ? warehouses?.split('~').map((id) => parseInt(id, 10))
            : [];
        return this.productsService.getCatalogProducts({
            categoryId,
            makeIdNum: makeIdNum ?? undefined,
            modelIdNum: modelIdNum ?? undefined,
            modificationIdNum: modificationIdNum ?? undefined,
            manufacturerIds,
            warehouseIds,
            sortBy,
            sortDir,
            page,
            limit,
        });
    }
    async getCatalogManufacturers(categoryId, modificationId) {
        return this.productsService.getCatalogManufacturers({
            categoryId,
            modificationId: modificationId ? Number(modificationId) : undefined,
        });
    }
    async getCatalogWarehouses(categoryId, modificationId) {
        return this.productsService.getCatalogWarehouses({
            categoryId,
            modificationId: modificationId ? Number(modificationId) : undefined,
        });
    }
    async getArticleProduct(skuFragment, page = 1, limit = 24) {
        return this.productsService.searchBySku(skuFragment, page, limit);
    }
    async getOemProduct(oemNumber, page = 1, limit = 24) {
        return this.productsService.searchByOem(oemNumber, page, limit);
    }
    async getProduct(sku, lang = 'en') {
        return this.productsService.getProductDetailsBySku(sku, lang);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('catalog'),
    __param(0, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('makeId')),
    __param(2, (0, common_1.Query)('modelId')),
    __param(3, (0, common_1.Query)('modificationId')),
    __param(4, (0, common_1.Query)('manufacturers')),
    __param(5, (0, common_1.Query)('warehouses')),
    __param(6, (0, common_1.Query)('sortBy')),
    __param(7, (0, common_1.Query)('sortDir')),
    __param(8, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(9, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(24), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCatalogProducts", null);
__decorate([
    (0, common_1.Get)('manufacturers'),
    __param(0, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('modificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCatalogManufacturers", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    __param(0, (0, common_1.Query)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('modificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCatalogWarehouses", null);
__decorate([
    (0, common_1.Get)('/searchBySku'),
    __param(0, (0, common_1.Query)('skuFragment')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getArticleProduct", null);
__decorate([
    (0, common_1.Get)('/searchByOem'),
    __param(0, (0, common_1.Query)('oemNumber')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getOemProduct", null);
__decorate([
    (0, common_1.Get)(':sku'),
    __param(0, (0, common_1.Param)('sku')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map