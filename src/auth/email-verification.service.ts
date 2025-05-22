import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailVerificationService {
  private codes = new Map<string, string>(); // временно, лучше Redis или БД

  async sendCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.codes.set(email, code);

    const transporter = nodemailer.createTransport({
      service: 'gmail', // или SMTP-сервер
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

  verifyCode(email: string, code: string): boolean {
    const stored = this.codes.get(email);
    if (stored === code) {
      this.codes.delete(email);
      return true;
    }
    throw new BadRequestException('Неверный код');
  }
}
