"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarInfoModule = void 0;
const common_1 = require("@nestjs/common");
const car_info_service_1 = require("./car-info.service");
const car_info_controller_1 = require("./car-info.controller");
const car_brand_entity_1 = require("./entities/car-brand.entity");
const car_model_entity_1 = require("./entities/car-model.entity");
const car_modification_entity_1 = require("./entities/car-modification.entity");
const typeorm_1 = require("@nestjs/typeorm");
let CarInfoModule = class CarInfoModule {
};
exports.CarInfoModule = CarInfoModule;
exports.CarInfoModule = CarInfoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([car_brand_entity_1.CarBrand, car_model_entity_1.CarModel, car_modification_entity_1.CarModification])],
        controllers: [car_info_controller_1.CarInfoController],
        providers: [car_info_service_1.CarInfoService],
    })
], CarInfoModule);
//# sourceMappingURL=car-info.module.js.map