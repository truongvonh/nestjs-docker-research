import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { AllExceptionFilter } from './shared/exception.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { uri } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { BoardModule } from './board/board.module';
import { RedisModule } from 'nestjs-redis';
import { REDIS_OPTIONS } from './database/redis/redis.options';
import { FileModule } from './file/file.module';
import { SentryInterceptor } from './shared/sentry.interceptor';

@Module({
  imports: [
    RedisModule.register(REDIS_OPTIONS),
    MongooseModule.forRoot(uri),
    CatModule,
    AuthModule,
    WorkspaceModule,
    UsersModule,
    BoardModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
