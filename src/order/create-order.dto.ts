import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsString()
  fullname: string;

  @IsString()
  email: string;

  @IsArray()
  items: any[];

  @IsNumber()
  sum: number;

  @IsString()
  deliveryMethod: string;

  @IsString()
  address: string;

  @IsString()
  payment: string;

  @IsString()
  comment?: string;
}
