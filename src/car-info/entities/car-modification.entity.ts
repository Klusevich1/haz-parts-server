// car-modification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity()
export class CarModification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modification: string;

  @Column('jsonb')
  engine: {
    code: string;
    type: string;
    power_kw: string;
    power_hp: string;
  };

  @Column()
  production_years: string;

  @Column()
  drive_type: string;

  @Column()
  link: string;

  @ManyToOne(() => CarModel, model => model.modifications)
  model: CarModel;
}
