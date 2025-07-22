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
    CODE_LIFETIME_MS = 5 * 60 * 1000;
    RESEND_TIMEOUT_MS = 60 * 1000;
    transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ZOHO_NOTICE_USER,
            pass: process.env.ZOHO_NOTICE_PASS,
        },
    });
    async sendCode(email) {
        const existing = this.codes.get(email);
        const now = Date.now();
        if (existing && now - existing.lastSentAt < this.RESEND_TIMEOUT_MS) {
            throw new common_1.BadRequestException('Подождите перед повторной отправкой кода');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.codes.set(email, {
            code,
            expiresAt: now + this.CODE_LIFETIME_MS,
            attempts: 0,
            lastSentAt: now,
        });
        const htmlMessage = `
      <div>
        <p>Здравствуйте!</p>
        <p>Ваш код подтверждения: <strong>${code}</strong></p>
        <p>Он действует в течение 5 минут.</p>
        <p>С уважением,<br/>Команда hazparts</p>
      </div>
    `;
        await this.transporter.sendMail({
            from: '"Hazparts Notice" <notice@hazparts.com>',
            to: email,
            subject: 'Код подтверждения',
            html: htmlMessage,
        });
    }
    verifyCode(email, code) {
        const entry = this.codes.get(email);
        const now = Date.now();
        if (!entry)
            throw new common_1.BadRequestException('Код не найден');
        if (now > entry.expiresAt) {
            this.codes.delete(email);
            throw new common_1.BadRequestException('Код истёк');
        }
        if (entry.code !== code) {
            entry.attempts += 1;
            this.codes.set(email, entry);
            throw new common_1.BadRequestException('Неверный код');
        }
        this.codes.delete(email);
        return true;
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)()
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map