import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;
  
  @Column()
  group_id: number;
}
