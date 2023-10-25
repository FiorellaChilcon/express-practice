import { env } from '@/main/config';
import { RedisClientType, SetOptions, createClient } from 'redis';

export class RedisManager {
  private static _client?: RedisClientType;

  static getClient(): RedisClientType {
    if (!RedisManager._client) {
      const url = env.redis.url;
      const redis = createClient({ url });
      redis.on('error', (err) => console.log('Redis Client Error', err));
      RedisManager._client = redis as RedisClientType;
    }
    return RedisManager._client;
  }

  static async connect(): Promise<void> {
    const redis = RedisManager.getClient();
    await redis.connect();
  }

  static async disconnect(): Promise<void> {
    if (RedisManager._client) await RedisManager._client.quit();
  }

  static async get(key: string) {
    return RedisManager.getClient().get(key);
  }

  static async set(key: string, data: string, options?: SetOptions) {
    return RedisManager.getClient().set(key, data, options);
  }

  static async del(key: string) {
    return RedisManager.getClient().del(key);
  }
}
