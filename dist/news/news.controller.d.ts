import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    getAllMasters(): Promise<import("./news.entity").News[]>;
    createMaster(data: {
        title: string;
        miniDescription: string;
        imagePath: string;
    }): Promise<import("./news.entity").News>;
}
