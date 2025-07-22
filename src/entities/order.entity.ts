import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('orders')
@Unique(['orderNumber'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'order_number', type: 'int', unique: true })
  orderNumber: number;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  deliveryMethod: string;

  @Column()
  address: string;

  @Column()
  payment: string;

  @Column({ nullable: true })
  comment?: string;

  @Column('json')
  items: any[];

  @CreateDateColumn()
  createdAt: Date;
}
