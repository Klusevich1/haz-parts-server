import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;
}
