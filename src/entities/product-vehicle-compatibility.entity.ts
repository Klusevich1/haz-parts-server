import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductVehicleCompatibility')
export class ProductVehicleCompatibility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  modification_id: number;
}
