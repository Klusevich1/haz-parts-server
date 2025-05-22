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
exports.CarInfoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const car_brand_entity_1 = require("./entities/car-brand.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let CarInfoService = class CarInfoService {
    carBrandRepository;
    constructor(carBrandRepository) {
        this.carBrandRepository = carBrandRepository;
    }
    async getAllBrands() {
        return this.carBrandRepository.find();
    }
    async getAllBrandsNames() {
        const raw = await this.carBrandRepository
            .createQueryBuilder('brand')
            .select('brand.name', 'name')
            .orderBy('brand.name', 'ASC')
            .getRawMany();
        return raw;
    }
    async getModelsByBrandName(brandName) {
        const brand = await this.carBrandRepository.findOne({
            where: { name: brandName.toUpperCase() },
            relations: ['models'],
        });
        if (!brand) {
            throw new Error(`Бренд ${brandName} не найден`);
        }
        return brand.models;
    }
    async loadCarDataFromFile() {
        const filePath = (0, path_1.join)(process.cwd(), 'src', 'data', 'car_info.json');
        const carData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
        const results = [];
        for (const brand of carData) {
            const saved = await this.carBrandRepository.save(brand);
            results.push(saved);
        }
        return {
            message: 'Данные успешно загружены в базу',
            count: results.length,
        };
    }
};
exports.CarInfoService = CarInfoService;
exports.CarInfoService = CarInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(car_brand_entity_1.CarBrand)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CarInfoService);
//# sourceMappingURL=car-info.service.js.map