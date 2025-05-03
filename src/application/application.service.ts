import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async createApplication(data: { fullname: string; phone: string }) {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: this.configService.get<string>('SMTP_TO'),
      subject: 'Заявка на звонок',
      text: `Имя: ${data.fullname}\nТелефон: ${data.phone}\n`,
    };
    await this.transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'Заявка успешно отправлена',
    };
  }
}
