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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = void 0;
const typeorm_1 = require("typeorm");
const car_brand_entity_1 = require("./car-brand.entity");
const car_modification_entity_1 = require("./car-modification.entity");
let CarModel = class CarModel {
    id;
    name;
    body;
    years;
    image;
    link;
    brand;
    modifications;
};
exports.CarModel = CarModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CarModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModel.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModel.prototype, "years", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModel.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModel.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => car_brand_entity_1.CarBrand, brand => brand.models),
    __metadata("design:type", car_brand_entity_1.CarBrand)
], CarModel.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => car_modification_entity_1.CarModification, mod => mod.model, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], CarModel.prototype, "modifications", void 0);
exports.CarModel = CarModel = __decorate([
    (0, typeorm_1.Entity)()
], CarModel);
//# sourceMappingURL=car-model.entity.js.map