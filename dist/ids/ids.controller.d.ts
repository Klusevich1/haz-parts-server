import { IdsService } from './ids.service';
export declare class IdsController {
    private readonly idsService;
    constructor(idsService: IdsService);
    getMakeId(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
    getModelId(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
    getModificationId(slug: string): Promise<{
        id: number | null;
        name: string | null;
    }>;
    getManufacturerIds(slugs: string[]): Promise<{
        ids: number[];
    }>;
    getWarehouseIds(slugs: string[]): Promise<{
        ids: number[];
    }>;
}
