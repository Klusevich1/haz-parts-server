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
exports.EmailVerificationService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const redis_service_1 = require("../redis/redis.service");
let EmailVerificationService = class EmailVerificationService {
    redisService;
    RESEND_TIMEOUT_SECONDS = 60;
    CODE_LIFETIME_SECONDS = 300;
    MAX_ATTEMPTS = 5;
    constructor(redisService) {
        this.redisService = redisService;
    }
    transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ZOHO_NOTICE_USER,
            pass: process.env.ZOHO_NOTICE_PASS,
        },
    });
    resetVerifiedEmails = new Map();
    markEmailAsVerifiedForReset(email) {
        const expiresAt = Date.now() + 2 * 60 * 1000;
        this.resetVerifiedEmails.set(email, expiresAt);
    }
    isEmailVerifiedForReset(email) {
        const expiresAt = this.resetVerifiedEmails.get(email);
        if (!expiresAt)
            return false;
        if (Date.now() > expiresAt) {
            this.resetVerifiedEmails.delete(email);
            return false;
        }
        return true;
    }
    consumeEmailVerification(email) {
        this.resetVerifiedEmails.delete(email);
    }
    async sendCode(email) {
        const cooldownKey = `email:code:cooldown:${email}`;
        const cooldown = await this.redisService.get(cooldownKey);
        if (cooldown) {
            throw new common_1.BadRequestException('Подождите перед повторной отправкой кода');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const entry = JSON.stringify({
            code,
            attempts: 0,
        });
        await this.redisService.set(`email:code:${email}`, entry, this.CODE_LIFETIME_SECONDS);
        await this.redisService.set(cooldownKey, '1', this.RESEND_TIMEOUT_SECONDS);
        const htmlMessage = `
      <div>
        <p>Hello!</p>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>It is valid for 5 minutes.</p>
        <p>Best regards,<br/>The Hazparts team</p>
      </div>
    `;
        await this.transporter.sendMail({
            from: '"Hazparts Notice" <notice@hazparts.com>',
            to: email,
            subject: 'Verification Code',
            html: htmlMessage,
        });
    }
    async verifyCode(email, code) {
        const redisKey = `email:code:${email}`;
        const raw = await this.redisService.get(redisKey);
        if (!raw) {
            throw new common_1.BadRequestException('Код истёк или не найден');
        }
        const data = JSON.parse(raw);
        if (data.attempts >= this.MAX_ATTEMPTS) {
            await this.redisService.del(redisKey);
            throw new common_1.BadRequestException('Слишком много попыток');
        }
        if (data.code !== code) {
            data.attempts += 1;
            await this.redisService.set(redisKey, JSON.stringify(data), this.CODE_LIFETIME_SECONDS);
            throw new common_1.BadRequestException('Неверный код');
        }
        await this.redisService.del(redisKey);
        return true;
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map