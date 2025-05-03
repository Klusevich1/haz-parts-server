import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  default_address?: string;

  @IsOptional()
  @IsString()
  default_pm?: string;

  @IsOptional()
  @IsString()
  default_dm?: string;
}
