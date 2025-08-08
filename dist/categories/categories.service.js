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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoriesService = class CategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async getAllCategories(lang) {
        const validLangs = ['ru', 'en', 'lv'];
        const columnSuffix = validLangs.includes(lang) ? lang : 'ru';
        return await this.categoryRepository.query(`
    SELECT 
      c.id, 
      c.name_${columnSuffix} AS name, 
      c.slug, 
      c.group_id, 
      cg.name_${columnSuffix} AS group_name
    FROM Categories c
    LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
    ORDER BY cg.name_${columnSuffix}, c.name_${columnSuffix};
    `);
    }
    async findByModification(modificationId, lang) {
        const validLangs = ['ru', 'en', 'lv'];
        const columnSuffix = validLangs.includes(lang) ? lang : 'ru';
        return this.categoryRepository.query(`
    SELECT DISTINCT 
      c.id,
      c.slug,
      c.group_id,
      c.name_${columnSuffix} AS name,
      cg.name_${columnSuffix} AS group_name
    FROM Categories c
    JOIN Products p ON p.category_id = c.id
    JOIN ProductVehicleCompatibility pvc ON pvc.product_id = p.id
    LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
    WHERE pvc.modification_id = ?
    `, [modificationId]);
    }
    async findBySlug(slug, lang) {
        try {
            const validLangs = ['ru', 'en', 'lv'];
            const columnSuffix = validLangs.includes(lang) ? lang : 'en';
            const result = await this.categoryRepository.query(`
      SELECT c.id, c.name_${columnSuffix} AS name, c.slug, c.group_id, cg.name_${columnSuffix} AS group_name
      FROM Categories c
      LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
      WHERE c.slug = ?
      LIMIT 1
      `, [slug]);
            if (!result || result.length === 0) {
                return null;
            }
            return result[0];
        }
        catch (error) {
            console.error('Error finding category by slug:', error);
            throw error;
        }
    }
    async findGroupByCategoryId(groupId, lang) {
        try {
            const validLangs = ['ru', 'en', 'lv'];
            const columnSuffix = validLangs.includes(lang) ? lang : 'en';
            const categories = await this.categoryRepository.query(`
      SELECT c.id, c.name_${columnSuffix} AS name, c.slug, c.group_id, cg.name_${columnSuffix} AS group_name
      FROM Categories c
      LEFT JOIN CategoryGroups cg ON c.group_id = cg.id
      WHERE c.group_id = ?
      ORDER BY c.name_${columnSuffix}
      `, [groupId]);
            return {
                group_name: categories.group_name,
                categories,
            };
        }
        catch (error) {
            console.error('Error in findGroupByCategorySlug:', error);
            throw error;
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map