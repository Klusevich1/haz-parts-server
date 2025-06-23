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
const category_entity_1 = require("./category.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let CategoriesService = class CategoriesService {
    categoryRepository;
    categoryRepositoryRu;
    categoryRepositoryLv;
    constructor(categoryRepository, categoryRepositoryRu, categoryRepositoryLv) {
        this.categoryRepository = categoryRepository;
        this.categoryRepositoryRu = categoryRepositoryRu;
        this.categoryRepositoryLv = categoryRepositoryLv;
    }
    async getAllCategories() {
        return await this.categoryRepository.query(`SELECT id, name FROM Categories ORDER BY name;`);
    }
    async findBySlug(slug) {
        try {
            const category = await this.categoryRepository.findOne({
                where: { slug },
            });
            console.log(category);
            if (!category) {
                return null;
            }
            return {
                id: category.id,
                category: category.category,
                subcategories: category.subcategories,
                image: category.image,
                slug: category.slug,
            };
        }
        catch (error) {
            console.error('Error finding category by slug:', error);
            throw error;
        }
    }
    async createCategory(data) {
        if (data.locale === 'ru') {
            const category = this.categoryRepositoryRu.create({
                category: data.category,
                subcategories: data.subcategories,
                image: data.image,
                slug: data.slug,
            });
            return this.categoryRepositoryRu.save(category);
        }
        else if (data.locale === 'lv') {
            const category = this.categoryRepositoryLv.create({
                category: data.category,
                subcategories: data.subcategories,
                image: data.image,
                slug: data.slug,
            });
            return this.categoryRepositoryLv.save(category);
        }
        else {
            const category = this.categoryRepository.create({
                category: data.category,
                subcategories: data.subcategories,
                image: data.image,
                slug: data.slug,
            });
            return this.categoryRepository.save(category);
        }
    }
    async loadAllFromFile(locale) {
        let jsonData;
        let repository;
        if (locale === 'lv') {
            const filePath = (0, path_1.join)(process.cwd(), 'src', 'data', 'final_all_categoriesLV.json');
            jsonData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
            repository = this.categoryRepositoryLv;
        }
        else if (locale === 'ru') {
            const filePath = (0, path_1.join)(process.cwd(), 'src', 'data', 'final_all_categoriesRU.json');
            jsonData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
            repository = this.categoryRepositoryRu;
        }
        else {
            const filePath = (0, path_1.join)(process.cwd(), 'src', 'data', 'final_all_categories.json');
            jsonData = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
            repository = this.categoryRepository;
        }
        await repository.clear();
        const results = [];
        for (const item of jsonData) {
            const saved = await this.createCategory({
                locale: locale,
                category: item.category,
                subcategories: item.subcategories,
                image: item.image,
                slug: item.slug,
            });
            results.push(saved);
        }
        return results;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryRu)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryLv)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map