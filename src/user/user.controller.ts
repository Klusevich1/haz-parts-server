import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User as CurrentUser } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddAddressDto } from './dto/add-address.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: { userId: number }) {
    return this.userService.findById(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getUserAddresses(@CurrentUser() user: { userId: number }) {
    return this.userService.getAddresses(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: { userId: number },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  addUserAddress(
    @CurrentUser() user: { userId: number },
    @Body() dto: AddAddressDto,
  ) {
    return this.userService.addAddress(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateProfile(
    @CurrentUser() user: { userId: number },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user.userId, dto);
  }
}
