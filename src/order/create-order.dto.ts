import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  userPhone: string;

  @IsString()
  @IsOptional()
  userMail?: string;

  @IsNumber()
  @IsNotEmpty()
  orderPrice: number;

  @IsArray()
  @IsNotEmpty()
  cartItems: any[];

  @IsString()
  @IsNotEmpty()
  deliveryType: string;

  @IsString()
  @IsOptional()
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
