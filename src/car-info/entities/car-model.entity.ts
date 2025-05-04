// car-model.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CarBrand } from './car-brand.entity';
import { CarModification } from './car-modification.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  body: string;

  @Column()
  years: string;

  @Column()
  image: string;

  @Column()
  link: string;

  @ManyToOne(() => CarBrand, brand => brand.models)
  brand: CarBrand;

  @OneToMany(() => CarModification, mod => mod.model, { cascade: true, eager: true })
  modifications: CarModification[];
}
