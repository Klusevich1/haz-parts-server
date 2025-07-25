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
const fs_1 = require("fs");
const path_1 = require("path");
const make_entity_1 = require("../entities/make.entity");
const model_entity_1 = require("../entities/model.entity");
const model_modification_entity_1 = require("../entities/model-modification.entity");
let CarInfoService = class CarInfoService {
    makeRepository;
    modelRepository;
    modificationRepository;
    constructor(makeRepository, modelRepository, modificationRepository) {
        this.makeRepository = makeRepository;
        this.modelRepository = modelRepository;
        this.modificationRepository = modificationRepository;
    }
    async getAllBrands() {
        return await this.makeRepository.query(`SELECT DISTINCT mk.id, mk.name, mk.logo_url, mk.slug
       FROM Makes mk
       JOIN Models mdl ON mdl.make_id = mk.id
       ORDER BY mk.name;
      `);
    }
    async getModelsByMake(makeId) {
        return await this.modelRepository.query(`SELECT id, name, model_url, slug FROM Models WHERE make_id = ? ORDER BY name;`, [makeId]);
    }
    async getModificationsByModel(modelId) {
        return await this.modificationRepository.query(`SELECT id, name, power, year_from, year_to, slug
     FROM ModelModifications
     WHERE model_id = ?
     ORDER BY year_from;`, [modelId]);
    }
    async loadCarDataFromFile() {
        const filePath = (0, path_1.join)(process.cwd(), 'src', 'data', 'car_info.json');
        const carData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
        const results = [];
        for (const brand of carData) {
            const saved = await this.makeRepository.save(brand);
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
    __param(0, (0, typeorm_1.InjectRepository)(make_entity_1.Make)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(model_modification_entity_1.ModelModification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CarInfoService);
//# sourceMappingURL=car-info.service.js.map