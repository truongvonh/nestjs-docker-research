import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from './board.schema';
import { BoardController } from './board.controller';
import { WorkspaceModel, WorkspaceSchema } from '../workspace/workspace.schema';
import { RedisModule } from 'nestjs-redis';
import { CachingService } from '../database/redis/redis.service';
import { BoardService } from './board.service';
import { UserModel, UserSchema } from '../users/user.schema';
import { CachingUserBoardMiddleware } from './middlewares/caching.middleware';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: BoardModel.name, schema: BoardSchema },
      { name: WorkspaceModel.name, schema: WorkspaceSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
  ],
  controllers: [BoardController],
  providers: [CachingService, BoardService],
})
export class BoardModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(CachingUserBoardMiddleware).forRoutes({
      path: 'board/:userId',
      method: RequestMethod.GET,
    });
  }
}
