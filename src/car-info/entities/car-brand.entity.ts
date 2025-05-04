import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity()
export class CarBrand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  logo_url: string;

  @Column()
  url: string;

  @OneToMany(() => CarModel, (model) => model.brand, {
    cascade: true,
    eager: true,
  })
  models: CarModel[];
}
