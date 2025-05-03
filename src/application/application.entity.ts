import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column('decimal')
  price: number;

  @Column()
  location: string;

  @Column()
  master: string;

  @Column()
  masterGrade: string;

  @Column()
  time: string;
}
