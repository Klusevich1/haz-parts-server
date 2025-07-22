import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductAttributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column({ nullable: true, length: 255 })
  name: string;

  @Column({ nullable: true, length: 255 })
  value: string;
}
