import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Models')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  model_url: string;

  @Column({ length: 255 })
  slug: string;
}
