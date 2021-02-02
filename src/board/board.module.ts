import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from './board.schema';
import { BoardController } from './board.controller';
import { RedisModule } from 'nestjs-redis';
import { BoardService } from './board.service';
import { UserModel, UserSchema } from '../users/user.schema';
import { UsersModule } from '../users/users.module';
import { ListsModel, ListsSchema } from '../lists/lists.schema';
import { DeviceService } from '../device/device.service';
import { OneSignalService } from '../shared/services/one-signal.service';
import { DeviceModel, DeviceSchema } from '../device/device.scheme';
import { BullModule } from '@nestjs/bull';
import { BOARD_QUEUE } from './queue.constants';
import { BoardQueueProcessor } from './board.processor';
import { BoardGateway } from './board.gateway';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RedisModule,
    MongooseModule.forFeature([
      { name: BoardModel.name, schema: BoardSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: ListsModel.name, schema: ListsSchema },
      { name: DeviceModel.name, schema: DeviceSchema },
    ]),
    BullModule.registerQueue({
      name: BOARD_QUEUE,
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, DeviceService, OneSignalService, BoardQueueProcessor, BoardGateway],
})
export class BoardModule {}
