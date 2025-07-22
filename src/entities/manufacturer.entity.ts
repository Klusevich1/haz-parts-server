import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Manufacturers')
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;
}
