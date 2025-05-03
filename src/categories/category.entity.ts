import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column('jsonb')
  subcategories: { name: string; slug: string }[];

  @Column({ nullable: true })
  image?: string;

  @Column({ unique: true })
  slug: string;
}
