import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Невалидный email' })
  email: string;

  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @IsOptional({ message: 'Фамилия не обязательно' })
  surname: string;
}
