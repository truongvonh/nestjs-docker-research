import * as redisIoAdapter from 'socket.io-redis';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { redisHost } from '../app.module';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    // @ts-ignore
    const redisAdapter = redisIoAdapter({
      host: redisHost,
      port: +process.env.REDIS_PORT,
    });
    server.adapter(redisAdapter);
    return server;
  }
}
