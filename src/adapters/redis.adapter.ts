import * as redisIoAdapter from 'socket.io-redis';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    // @ts-ignore
    const redisAdapter = redisIoAdapter({
      name: process.env.REDIS_NAME,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    });

    server.adapter(redisAdapter);
    return server;
  }
}
