import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailVerificationService } from './email-verification.service';
export declare class AuthController {
    private readonly authService;
    private readonly emailVerificationService;
    constructor(authService: AuthService, emailVerificationService: EmailVerificationService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    checkEmail(dto: {
        email: string;
        mode: 'login' | 'register' | 'forgot';
    }): Promise<{
        available: boolean;
    }>;
    sendConfirmationCode(email: string): Promise<void>;
    verifyCodeAndRegister(dto: RegisterDto & {
        code: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    } | undefined>;
    verifyResetCode(dto: {
        email: string;
        code: string;
    }): Promise<{
        reset_token: string;
    }>;
    resetPassword(dto: {
        reset_token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    refresh(token: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    verifyEmailUpdate(body: {
        email: string;
        code: string;
    }): {
        success: boolean;
    };
}
