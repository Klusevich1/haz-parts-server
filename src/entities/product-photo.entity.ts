import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductPhotos')
export class ProductPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column({ length: 255 })
  photo_url: string;

  @Column()
  is_main: boolean;
}
