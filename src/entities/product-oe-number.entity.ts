import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductOENumbers')
export class ProductOENumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  make_id: number;

  @Column({ length: 1000 })
  oe_number: string;
}
