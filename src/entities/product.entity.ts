import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true, length: 255 })
  sku: string;

  @Column()
  category_id: number;

  @Column()
  manufacturer_id: number;
}
