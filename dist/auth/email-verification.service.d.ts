export declare class EmailVerificationService {
    private codes;
    sendCode(email: string): Promise<void>;
    verifyCode(email: string, code: string): boolean;
}
