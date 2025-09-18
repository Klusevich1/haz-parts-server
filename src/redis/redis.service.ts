// src/redis/redis.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string | string[]) {
    if (Array.isArray(key)) await this.client.del(...key);
    else await this.client.del(key);
  }

  async exists(key: string) {
    return this.client.exists(key);
  }

  async expire(key: string, ttlSeconds: number) {
    await this.client.expire(key, ttlSeconds);
  }

  // --- множества для управления RT пользователя ---
  async sAdd(key: string, member: string) {
    await this.client.sadd(key, member);
  }

  async sRem(key: string, member: string) {
    await this.client.srem(key, member);
  }

  async sMembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
