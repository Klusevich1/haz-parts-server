import { Repository } from 'typeorm';
import { News } from './news.entity';
export declare class NewsService {
    private newsRepository;
    constructor(newsRepository: Repository<News>);
    findAll(): Promise<News[]>;
    createNews(data: {
        title: string;
        miniDescription: string;
        imagePath: string;
    }): Promise<News>;
}
