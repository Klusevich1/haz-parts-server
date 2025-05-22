import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddAddressDto {
  @IsEnum(['Physical', 'Legal'])
  type: 'Physical' | 'Legal';

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  postcode: string;
}
