import { ApplicationService } from './application.service';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    createApplication(data: {
        fullname: string;
        phone: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
