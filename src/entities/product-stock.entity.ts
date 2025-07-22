import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductStock')
export class ProductStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  warehouse_id: number;

  @Column({ default: 0 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ default: 1 })
  min_order_quantity: number;

  @Column({ default: true })
  returnable: boolean;

  @Column({ length: 50, nullable: true })
  delivery_time: string;
}
