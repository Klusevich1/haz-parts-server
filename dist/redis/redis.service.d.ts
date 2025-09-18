import { OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleDestroy {
    private client;
    constructor();
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string | string[]): Promise<void>;
    exists(key: string): Promise<number>;
    expire(key: string, ttlSeconds: number): Promise<void>;
    sAdd(key: string, member: string): Promise<void>;
    sRem(key: string, member: string): Promise<void>;
    sMembers(key: string): Promise<string[]>;
    onModuleDestroy(): Promise<void>;
}
