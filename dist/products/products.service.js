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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_entity_2 = require("./product.entity");
const product_entity_3 = require("./product.entity");
const product_entity_4 = require("./product.entity");
const category_entity_1 = require("../categories/category.entity");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    brandRepository;
    modelRepository;
    modificationRepository;
    constructor(productRepository, categoryRepository, brandRepository, modelRepository, modificationRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.modelRepository = modelRepository;
        this.modificationRepository = modificationRepository;
    }
    async getCatalogProducts(params) {
        const { categoryId, modelId, modificationId, manufacturerId, warehouseId, makeId, sortBy = 'name', sortDir = 'ASC', page = 1, limit = 24, } = params;
        const offset = (page - 1) * limit;
        const result = await this.productRepository.query(`
    SELECT DISTINCT p.id, p.name, p.sku
    FROM Products p
    JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id
    JOIN ModelModifications mm ON mm.id = pvc.modification_id
    JOIN Models m ON m.id = mm.model_id
    JOIN Makes mk ON mk.id = m.make_id
    JOIN ProductStock ps ON ps.product_id = p.id
    JOIN Warehouses w ON w.id = ps.warehouse_id
    WHERE p.category_id = ?
      AND (? IS NULL OR m.id = ?)
      AND (? IS NULL OR mm.id = ?)
      AND (? IS NULL OR p.manufacturer_id = ?)
      AND (? IS NULL OR mk.id = ?)
      AND (? IS NULL OR w.id = ?)
    ORDER BY ${sortBy === 'price' ? 'ps.price' : 'p.name'} ${sortDir}
    LIMIT ? OFFSET ?
    `, [
            categoryId,
            modelId ?? null,
            modelId ?? null,
            modificationId ?? null,
            modificationId ?? null,
            manufacturerId ?? null,
            manufacturerId ?? null,
            makeId ?? null,
            makeId ?? null,
            warehouseId ?? null,
            warehouseId ?? null,
            limit,
            offset,
        ]);
        return result;
    }
    async getProductDetailsBySku(sku) {
        const product = await this.productRepository.findOne({
            where: { sku },
        });
        if (!product)
            return null;
        const productId = product.id;
        const [attributes, photos, stock, oeNumbers, compatibility] = await Promise.all([
            this.productRepository.query(`SELECT name, value FROM ProductAttributes WHERE product_id = ?`, [productId]),
            this.productRepository.query(`SELECT photo_url, is_main FROM ProductPhotos WHERE product_id = ?`, [productId]),
            this.productRepository.query(`SELECT w.name AS warehouse, ps.quantity, ps.price, ps.delivery_time, ps.min_order_quantity, ps.returnable
       FROM ProductStock ps
       JOIN Warehouses w ON w.id = ps.warehouse_id
       WHERE ps.product_id = ?`, [productId]),
            this.productRepository.query(`SELECT mk.name AS make, po.oe_number
       FROM ProductOENumbers po
       JOIN Makes mk ON mk.id = po.make_id
       WHERE po.product_id = ?`, [productId]),
            this.productRepository.query(`SELECT mk.name AS make, mdl.name AS model, mm.name AS modification, mm.power, mm.year_from, mm.year_to
       FROM ProductVehicleCompatibility pvc
       JOIN ModelModifications mm ON mm.id = pvc.modification_id
       JOIN Models mdl ON mdl.id = mm.model_id
       JOIN Makes mk ON mk.id = mdl.make_id
       WHERE pvc.product_id = ?`, [productId]),
        ]);
        return {
            ...product,
            attributes,
            photos,
            stock,
            oeNumbers,
            compatibility,
        };
    }
    async searchByArticle(articleId) {
        return await this.productRepository.query(`SELECT id, name, sku FROM Products WHERE sku = ?`, [articleId]);
    }
    async searchByOem(oemNumber) {
        const results = await this.productRepository.query(`SELECT p.id, p.name, p.sku
     FROM ProductOENumbers po
     JOIN Products p ON p.id = po.product_id
     WHERE po.oe_number REGEXP CONCAT('(^|,\\s*)', ?, '(\\s*,|$)')`, [oemNumber]);
        return results;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_2.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_3.Model)),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_4.Modification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map