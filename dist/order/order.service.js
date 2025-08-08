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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../entities/order.entity");
const typeorm_2 = require("typeorm");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let OrderService = class OrderService {
    orderRepository;
    configService;
    transporter;
    constructor(orderRepository, configService) {
        this.orderRepository = orderRepository;
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_ORDER_USER,
                pass: process.env.ZOHO_ORDER_PASS,
            },
        });
    }
    async createOrder(dto) {
        const lastOrder = await this.orderRepository
            .createQueryBuilder('order')
            .orderBy('order.order_number', 'DESC')
            .getOne();
        const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 100000;
        const newOrder = this.orderRepository.create({
            ...dto,
            orderNumber: nextOrderNumber,
        });
        await this.orderRepository.save(newOrder);
        const itemLines = dto.items
            .map((item) => `• ${item.name} (${item.quantity} x ${item.price} €) [${item.hub}]`)
            .join('\n');
        const mailOptions = {
            from: '"Hazparts Order" <order@hazparts.com>',
            to: process.env.ZOHO_ORDER_USER,
            subject: `New order №${nextOrderNumber}`,
            text: `Order №${nextOrderNumber}\nFullname: ${dto.fullname}\nEmail: ${dto.email}\nDelivery Method: ${dto.deliveryMethod}\nPayment Method: ${dto.payment}\nProducts:\n${itemLines}\nOrder amount with taxes: ${dto.sum} €`,
        };
        await this.transporter.sendMail(mailOptions);
        return {
            success: true,
            message: `Заказ №${nextOrderNumber} успешно оформлен`,
            orderNumber: nextOrderNumber,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], OrderService);
//# sourceMappingURL=order.service.js.map