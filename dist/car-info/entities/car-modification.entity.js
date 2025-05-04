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
exports.CarModification = void 0;
const typeorm_1 = require("typeorm");
const car_model_entity_1 = require("./car-model.entity");
let CarModification = class CarModification {
    id;
    modification;
    engine;
    production_years;
    drive_type;
    link;
    model;
};
exports.CarModification = CarModification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CarModification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModification.prototype, "modification", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], CarModification.prototype, "engine", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModification.prototype, "production_years", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModification.prototype, "drive_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarModification.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => car_model_entity_1.CarModel, model => model.modifications),
    __metadata("design:type", car_model_entity_1.CarModel)
], CarModification.prototype, "model", void 0);
exports.CarModification = CarModification = __decorate([
    (0, typeorm_1.Entity)()
], CarModification);
//# sourceMappingURL=car-modification.entity.js.map