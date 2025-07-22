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
  async getProfile(@CurrentUser() user: { id: number }) {
    return this.userService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  getUserAddresses(@CurrentUser() user: { id: number }) {
    return this.userService.getAddresses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: { id: number },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  addUserAddress(
    @CurrentUser() user: { id: number },
    @Body() dto: AddAddressDto,
  ) {
    console.log(dto);
    return this.userService.addAddress(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateProfile(
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user.id, dto);
  }
}
