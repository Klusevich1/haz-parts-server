"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const application_module_1 = require("./application/application.module");
const order_module_1 = require("./order/order.module");
const products_module_1 = require("./products/products.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const car_info_module_1 = require("./car-info/car-info.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USER', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_NAME', 'mydatabase'),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            products_module_1.ProductsModule,
            application_module_1.ApplicationModule,
            car_info_module_1.CarInfoModule,
            order_module_1.OrderModule,
            products_module_1.ProductsModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            car_info_module_1.CarInfoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map