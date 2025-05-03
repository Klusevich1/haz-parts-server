import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;
  
  @IsString()
  @IsNotEmpty()
  model: string;
  
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  images: string[]; 
  
  @IsString()
  @IsOptional()
  characteristics?: Record<string, any>; 
}
