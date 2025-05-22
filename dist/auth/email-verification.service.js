"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailVerificationService = class EmailVerificationService {
    codes = new Map();
    async sendCode(email) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.codes.set(email, code);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: '"Support" <support@example.com>',
            to: email,
            subject: 'Код подтверждения',
            text: `Ваш код: ${code}`,
        });
    }
    verifyCode(email, code) {
        const stored = this.codes.get(email);
        if (stored === code) {
            this.codes.delete(email);
            return true;
        }
        throw new common_1.BadRequestException('Неверный код');
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)()
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map