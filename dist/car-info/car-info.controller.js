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
exports.CarInfoController = void 0;
const common_1 = require("@nestjs/common");
const car_info_service_1 = require("./car-info.service");
let CarInfoController = class CarInfoController {
    carInfoService;
    constructor(carInfoService) {
        this.carInfoService = carInfoService;
    }
    async getAllBrands() {
        return this.carInfoService.getAllBrands();
    }
    async getByMake(makeId) {
        return this.carInfoService.getModelsByMake(makeId);
    }
    async getByModel(modelId) {
        return this.carInfoService.getModificationsByModel(modelId);
    }
    async importCarData() {
        return this.carInfoService.loadCarDataFromFile();
    }
};
exports.CarInfoController = CarInfoController;
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarInfoController.prototype, "getAllBrands", null);
__decorate([
    (0, common_1.Get)('models'),
    __param(0, (0, common_1.Query)('makeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarInfoController.prototype, "getByMake", null);
__decorate([
    (0, common_1.Get)('modifications'),
    __param(0, (0, common_1.Query)('modelId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarInfoController.prototype, "getByModel", null);
__decorate([
    (0, common_1.Post)('import'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarInfoController.prototype, "importCarData", null);
exports.CarInfoController = CarInfoController = __decorate([
    (0, common_1.Controller)('car-info'),
    __metadata("design:paramtypes", [car_info_service_1.CarInfoService])
], CarInfoController);
//# sourceMappingURL=car-info.controller.js.map