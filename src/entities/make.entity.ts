import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Makes')
export class Make {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  logo_url: string;

  @Column({ length: 255 })
  slug: string;
}
