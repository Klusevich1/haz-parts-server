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
    async getProductsByFilters(filters) {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brands', 'brand')
            .leftJoinAndSelect('product.models', 'model')
            .leftJoinAndSelect('product.modifications', 'modification');
        if (filters.categorySlug) {
            query.andWhere('category.slug = :categorySlug', { categorySlug: filters.categorySlug });
        }
        if (filters.brandSlug) {
            query.andWhere('brand.slug = :brandSlug', { brandSlug: filters.brandSlug });
        }
        if (filters.modelSlug) {
            query.andWhere('model.slug = :modelSlug', { modelSlug: filters.modelSlug });
        }
        if (filters.modificationSlug) {
            query.andWhere('modification.slug = :modificationSlug', {
                modificationSlug: filters.modificationSlug
            });
        }
        return query.getMany();
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