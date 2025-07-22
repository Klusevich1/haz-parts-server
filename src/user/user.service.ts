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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
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
      `SELECT * FROM address WHERE user_id = ?`,
      [userId],
    );

    return addresses;
  }

  async addAddress(userId: number, dto: AddAddressDto): Promise<Address> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const address = this.addressRepo.create({
      ...dto,
      user,
    });

    return this.addressRepo.save(address);
  }
}
