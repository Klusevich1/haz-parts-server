import { IsInt, IsString, IsNumber, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  productId: number;

  @IsString()
  manufacturer_name: string;

  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsString()
  photo_url: string;

  @IsString()
  hub: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  availability: number;
}
