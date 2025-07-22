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
exports.IdsController = void 0;
const common_1 = require("@nestjs/common");
const ids_service_1 = require("./ids.service");
let IdsController = class IdsController {
    idsService;
    constructor(idsService) {
        this.idsService = idsService;
    }
    getMakeId(slug) {
        return this.idsService.getMakeIdBySlug(slug);
    }
    getModelId(slug) {
        return this.idsService.getModelIdBySlug(slug);
    }
    getModificationId(slug) {
        return this.idsService.getModificationIdBySlug(slug);
    }
    async getManufacturerIds(slugs) {
        const ids = await this.idsService.getManufacturerIds(slugs);
        return { ids };
    }
    async getWarehouseIds(slugs) {
        const ids = await this.idsService.getWarehouseIds(slugs);
        return { ids };
    }
};
exports.IdsController = IdsController;
__decorate([
    (0, common_1.Get)('make/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdsController.prototype, "getMakeId", null);
__decorate([
    (0, common_1.Get)('model/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdsController.prototype, "getModelId", null);
__decorate([
    (0, common_1.Get)('modification/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IdsController.prototype, "getModificationId", null);
__decorate([
    (0, common_1.Post)('manufacturers'),
    __param(0, (0, common_1.Body)('slugs')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IdsController.prototype, "getManufacturerIds", null);
__decorate([
    (0, common_1.Post)('warehouses'),
    __param(0, (0, common_1.Body)('slugs')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IdsController.prototype, "getWarehouseIds", null);
exports.IdsController = IdsController = __decorate([
    (0, common_1.Controller)('ids'),
    __metadata("design:paramtypes", [ids_service_1.IdsService])
], IdsController);
//# sourceMappingURL=ids.controller.js.map