import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { ERRORS_MESSAGE } from '../../constants/messages/errors';

@Injectable()
export class CachingService {
  constructor(private readonly redisService: RedisService) {}
  private redisName: string = process.env.REDIS_NAME;

  public async getString(key: string): Promise<string> {
    return await this.redisService.getClient(this.redisName).get(key);
  }

  public async getParse<T>(key: string): Promise<T> {
    try {
      const result = await this.redisService.getClient(this.redisName).get(key);
      return JSON.parse(result) as T;
    } catch (e) {
      return null;
    }
  }

  public async set<T>(key: string, value: T): Promise<string> {
    try {
      const storeValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      return this.redisService.getClient(this.redisName).set(key, storeValue);
    } catch (e) {
      throw new HttpException(
        ERRORS_MESSAGE.REDIS_ERROR_SET_KEY,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async existKey(key: string): Promise<number> {
    return this.redisService.getClient(this.redisName).exists(key);
  }
}
