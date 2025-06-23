import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { EmailVerificationService } from './email-verification.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log(dto);
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('check-email')
  checkEmail(@Body('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Post('send-confirmation-code')
  async sendConfirmationCode(@Body('email') email: string) {
    return this.emailVerificationService.sendCode(email);
  }

  @Post('verify-confirmation-code')
  async verifyCodeAndRegister(@Body() dto: RegisterDto & { code: string }) {
    const isValid = this.emailVerificationService.verifyCode(
      dto.email,
      dto.code,
    );
    if (isValid) {
      return this.authService.register(dto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email-update')
  verifyEmailUpdate(
    @Body() body: { email: string; code: string },
  ) {
    const isValid = this.emailVerificationService.verifyCode(
      body.email,
      body.code,
    );

    if (!isValid) {
      throw new BadRequestException('Неверный или истёкший код');
    }

    return { success: true };
  }
}
