import { RedisService } from 'src/redis/redis.service';
export declare class EmailVerificationService {
    private readonly redisService;
    private RESEND_TIMEOUT_SECONDS;
    private CODE_LIFETIME_SECONDS;
    private MAX_ATTEMPTS;
    constructor(redisService: RedisService);
    private transporter;
    private readonly resetVerifiedEmails;
    markEmailAsVerifiedForReset(email: string): void;
    isEmailVerifiedForReset(email: string): boolean;
    consumeEmailVerification(email: string): void;
    sendCode(email: string): Promise<void>;
    verifyCode(email: string, code: string): Promise<boolean>;
}
