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
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    sendConfirmationCode(email: string): Promise<void>;
    verifyCodeAndRegister(dto: RegisterDto & {
        code: string;
    }): Promise<{
        access_token: string;
    } | undefined>;
}
