import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/adress.entity';
import { AddAddressDto } from './dto/add-address.dto';
import { Order } from 'src/entities/order.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    console.log(id);
    return this.userRepo.findOne({ where: { id } });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new BadRequestException('Текущий пароль неверен');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordHash = newHash;

    await this.save(user);
    return { message: 'Пароль успешно изменён' };
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException();

    Object.assign(user, dto);
    return this.save(user);
  }

  async getAddresses(userId: number): Promise<Address[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const addresses = await this.userRepo.query(
      `SELECT * FROM Address WHERE user_id = ?`,
      [userId],
    );

    return addresses;
  }

  async getOrders(userId: number): Promise<Order[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const orders = await this.userRepo.query(
      `SELECT * FROM Orders WHERE user_id = ?`,
      [userId],
    );

    return orders;
  }

  async addAddress(userId: number, dto: AddAddressDto): Promise<Address> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const addressCount = await this.addressRepo.count({
      where: { user: { id: userId } },
    });
    if (addressCount >= 15) {
      throw new BadRequestException('Превышено количество адресов (макс. 15)');
    }

    const address = this.addressRepo.create({
      ...dto,
      user,
    });

    return this.addressRepo.save(address);
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.redisService.del(`refresh:${payload.jti}`);
  }
}
