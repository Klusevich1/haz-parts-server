import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невалидный email' })
  email: string;

  @IsString({ message: 'Пароль обязателен' })
  password: string;
}
