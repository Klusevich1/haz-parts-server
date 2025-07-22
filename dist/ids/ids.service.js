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
exports.IdsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const make_entity_1 = require("../entities/make.entity");
const manufacturer_entity_1 = require("../entities/manufacturer.entity");
const model_modification_entity_1 = require("../entities/model-modification.entity");
const model_entity_1 = require("../entities/model.entity");
const warehouse_entity_1 = require("../entities/warehouse.entity");
const typeorm_2 = require("typeorm");
let IdsService = class IdsService {
    makeRepository;
    modelRepository;
    modificationRepository;
    manufacturerRepository;
    warehouseRepository;
    constructor(makeRepository, modelRepository, modificationRepository, manufacturerRepository, warehouseRepository) {
        this.makeRepository = makeRepository;
        this.modelRepository = modelRepository;
        this.modificationRepository = modificationRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.warehouseRepository = warehouseRepository;
    }
    async getManufacturerIds(slugs) {
        if (!slugs.length)
            return [];
        const result = await this.manufacturerRepository.query(`SELECT id FROM Manufacturers WHERE slug IN (?)`, [slugs]);
        return result.map((row) => row.id);
    }
    async getWarehouseIds(slugs) {
        if (!slugs.length)
            return [];
        const result = await this.warehouseRepository.query(`SELECT id FROM Warehouses WHERE slug IN (?)`, [slugs]);
        return result.map((row) => row.id);
    }
    async getMakeIdBySlug(slug) {
        const result = await this.makeRepository.query(`SELECT id, name FROM Makes WHERE slug = ? LIMIT 1`, [slug]);
        if (!result.length) {
            return { id: null, name: null };
        }
        return {
            id: result[0].id,
            name: result[0].name,
        };
    }
    async getModelIdBySlug(slug) {
        const result = await this.modelRepository.query(`SELECT id, name FROM Models WHERE slug = ? LIMIT 1`, [slug]);
        if (!result.length) {
            return { id: null, name: null };
        }
        return {
            id: result[0].id,
            name: result[0].name,
        };
    }
    async getModificationIdBySlug(slug) {
        const result = await this.modificationRepository.query(`SELECT id, name FROM ModelModifications WHERE slug = ? LIMIT 1`, [slug]);
        if (!result.length) {
            return { id: null, name: null };
        }
        return {
            id: result[0].id,
            name: result[0].name,
        };
    }
};
exports.IdsService = IdsService;
exports.IdsService = IdsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(make_entity_1.Make)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(model_modification_entity_1.ModelModification)),
    __param(3, (0, typeorm_1.InjectRepository)(manufacturer_entity_1.Manufacturer)),
    __param(4, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IdsService);
//# sourceMappingURL=ids.service.js.map