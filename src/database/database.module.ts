import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { CachingService } from './redis/redis.service';

@Module({
  providers: [...DatabaseProvider, CachingService],
})
export class DatabaseModule {}
