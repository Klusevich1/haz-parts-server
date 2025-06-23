export declare class EmailVerificationService {
    private codes;
    private CODE_LIFETIME_MS;
    private RESEND_TIMEOUT_MS;
    private transporter;
    sendCode(email: string): Promise<void>;
    verifyCode(email: string, code: string): boolean;
}
