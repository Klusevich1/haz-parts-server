import { ConfigService } from '@nestjs/config';
export declare class ApplicationService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    createApplication(data: {
        fullname: string;
        phone: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
