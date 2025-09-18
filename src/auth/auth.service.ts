import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email уже используется');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      surname: dto.surname,
    });

    return this.generateTokenPair(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateTokenPair(user.id);
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const exists = await this.redisService.get(`refresh:${payload.jti}`);
      if (!exists) throw new UnauthorizedException('Токен устарел или отозван');

      return this.generateTokenPair(payload.sub);
    } catch (e) {
      throw new UnauthorizedException('Неверный или просроченный токен');
    }
  }

  async checkEmail(email: string, mode: 'login' | 'register' | 'forgot') {
    const existing = await this.userService.findByEmail(email);
    if (mode === 'register') {
      if (existing) {
        throw new ConflictException('Email уже используется');
      }
    } else if (mode === 'forgot') {
      if (!existing) {
        throw new ConflictException('Аккаунта с таким Email не существует');
      }
    }
    return { available: true };
  }

  // Генерация токенов access_token и refresh_token для пользователя
  private async generateTokenPair(userId: number) {
    const jti = randomUUID();

    const access_token = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '15m' },
    );

    const refresh_token = this.jwtService.sign(
      { sub: userId, jti },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.redisService.set(
      `refresh:${jti}`,
      userId.toString(),
      60 * 60 * 24 * 7,
    );

    return { access_token, refresh_token };
  }

  // Логика для ситуации Забыли пароль
  async generateResetToken(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Пользователь не найден');

    return this.jwtService.sign(
      {
        sub: user.id,
        email,
        jti: randomUUID(),
      },
      {
        expiresIn: '10m',
        secret: process.env.JWT_RESET_SECRET,
      },
    );
  }

  async resetPasswordByToken(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_RESET_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) throw new NotFoundException('Пользователь не найден');

      const hash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = hash;

      await this.userService.save(user);

      return { message: 'Пароль успешно обновлён' };
    } catch (e) {
      throw new BadRequestException('Недействительный или истёкший токен');
    }
  }
}
