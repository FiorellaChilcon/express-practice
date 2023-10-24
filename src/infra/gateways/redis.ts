import { env } from '@/main/config';
import { RedisClientType, createClient } from 'redis';

export class RedisManager {
  private static connection?: RedisClientType;

  static async connect(): Promise<void> {
    const url = env.redis.url;
    const redis = createClient({ url });
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();
    this.connection = redis as RedisClientType;
  }

  static async disconnect(): Promise<void> {
    if (RedisManager.connection) await RedisManager.connection.quit();
  }
}
