"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdsModule = void 0;
const common_1 = require("@nestjs/common");
const ids_service_1 = require("./ids.service");
const ids_controller_1 = require("./ids.controller");
const make_entity_1 = require("../entities/make.entity");
const model_entity_1 = require("../entities/model.entity");
const model_modification_entity_1 = require("../entities/model-modification.entity");
const typeorm_1 = require("@nestjs/typeorm");
const manufacturer_entity_1 = require("../entities/manufacturer.entity");
const warehouse_entity_1 = require("../entities/warehouse.entity");
let IdsModule = class IdsModule {
};
exports.IdsModule = IdsModule;
exports.IdsModule = IdsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                make_entity_1.Make,
                model_entity_1.Model,
                model_modification_entity_1.ModelModification,
                manufacturer_entity_1.Manufacturer,
                warehouse_entity_1.Warehouse,
            ]),
        ],
        controllers: [ids_controller_1.IdsController],
        providers: [ids_service_1.IdsService],
    })
], IdsModule);
//# sourceMappingURL=ids.module.js.map