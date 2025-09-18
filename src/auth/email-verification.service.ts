import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { RedisService } from 'src/redis/redis.service';
// import Redis from 'ioredis'; // если решишь использовать Redis

interface CodeEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

@Injectable()
export class EmailVerificationService {
  private RESEND_TIMEOUT_SECONDS = 60;
  private CODE_LIFETIME_SECONDS = 300;
  private MAX_ATTEMPTS = 5;
  constructor(private readonly redisService: RedisService) {}

  private transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_NOTICE_USER,
      pass: process.env.ZOHO_NOTICE_PASS,
    },
  });

  private readonly resetVerifiedEmails = new Map<string, number>();

  markEmailAsVerifiedForReset(email: string) {
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 минуты
    this.resetVerifiedEmails.set(email, expiresAt);
  }

  isEmailVerifiedForReset(email: string): boolean {
    const expiresAt = this.resetVerifiedEmails.get(email);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.resetVerifiedEmails.delete(email);
      return false;
    }
    return true;
  }

  consumeEmailVerification(email: string) {
    this.resetVerifiedEmails.delete(email);
  }

  async sendCode(email: string) {
    const cooldownKey = `email:code:cooldown:${email}`;
    const cooldown = await this.redisService.get(cooldownKey);
    if (cooldown) {
      throw new BadRequestException('Подождите перед повторной отправкой кода');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const entry = JSON.stringify({
      code,
      attempts: 0,
    });

    await this.redisService.set(
      `email:code:${email}`,
      entry,
      this.CODE_LIFETIME_SECONDS,
    );
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

  async verifyCode(email: string, code: string): Promise<boolean> {
    const redisKey = `email:code:${email}`;
    const raw = await this.redisService.get(redisKey);
    if (!raw) {
      throw new BadRequestException('Код истёк или не найден');
    }

    const data: { code: string; attempts: number } = JSON.parse(raw);

    if (data.attempts >= this.MAX_ATTEMPTS) {
      await this.redisService.del(redisKey);
      throw new BadRequestException('Слишком много попыток');
    }

    if (data.code !== code) {
      data.attempts += 1;
      await this.redisService.set(
        redisKey,
        JSON.stringify(data),
        this.CODE_LIFETIME_SECONDS,
      );
      throw new BadRequestException('Неверный код');
    }

    await this.redisService.del(redisKey);
    return true;
  }
}
