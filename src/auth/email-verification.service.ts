import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import Redis from 'ioredis'; // если решишь использовать Redis

interface CodeEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

@Injectable()
export class EmailVerificationService {
  // Лучше Redis или БД, если на прод
  private codes = new Map<string, CodeEntry>();
  private CODE_LIFETIME_MS = 5 * 60 * 1000; // 5 минут
  private RESEND_TIMEOUT_MS = 60 * 1000; // 1 минута

  private transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  async sendCode(email: string) {
    const existing = this.codes.get(email);
    const now = Date.now();

    if (existing && now - existing.lastSentAt < this.RESEND_TIMEOUT_MS) {
      throw new BadRequestException('Подождите перед повторной отправкой кода');
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

  verifyCode(email: string, code: string): boolean {
    const entry = this.codes.get(email);
    const now = Date.now();

    if (!entry) throw new BadRequestException('Код не найден');
    if (now > entry.expiresAt) {
      this.codes.delete(email);
      throw new BadRequestException('Код истёк');
    }

    if (entry.code !== code) {
      entry.attempts += 1;
      this.codes.set(email, entry); // обновим
      throw new BadRequestException('Неверный код');
    }

    this.codes.delete(email);
    return true;
  }
}
