import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './create-order.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  private transporter;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
  ) {
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

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<{ success: boolean; message: string; orderNumber: number }> {
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
      .map(
        (item) =>
          `• ${item.name} (${item.quantity} x ${item.price} €) [${item.hub}]`,
      )
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
}
