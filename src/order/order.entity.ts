// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNumber: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  userPhone: string;

  @Column()
  userMail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  orderPrice: number;

  @Column({ type: 'jsonb' })
  cartItems: any;

  @Column()
  deliveryType: string;

  @Column()
  deliveryAddress: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
