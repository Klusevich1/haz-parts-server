// address.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'Physical' | 'Legal';

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  postcode: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;
}
