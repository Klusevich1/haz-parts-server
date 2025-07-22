import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ModelModifications')
export class ModelModification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model_id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 50, nullable: true })
  power: string;

  @Column({ length: 50, nullable: true })
  year_from: string;

  @Column({ length: 50, nullable: true })
  year_to: string;

  @Column({ length: 255 })
  slug: string;
}
