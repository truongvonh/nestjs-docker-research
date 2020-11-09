import { RedisModuleOptions } from 'nestjs-redis';
import { Logger } from '@nestjs/common';

export const REDIS_OPTIONS = {
  name: process.env.REDIS_NAME,
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  onClientReady: async (client): Promise<void> => {
    client.on('connect', () => {
      Logger.debug('Redis connected');
    });
  },
} as RedisModuleOptions;
