import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from '../board/board.schema';
import { ListsModel, ListsSchema } from './lists.schema';
import { BullModule } from '@nestjs/bull';
import { LIST_QUEUE } from './queue.constants';
import { ListQueueProcessor } from './list.processor';
import { BoardService } from '../board/board.service';
import { BoardGateway } from '../board/board.gateway';
import { CardModel, CardSchema } from '../card/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoardModel.name, schema: BoardSchema },
      { name: ListsModel.name, schema: ListsSchema },
      { name: CardModel.name, schema: CardSchema },
    ]),
    BullModule.registerQueue({
      name: LIST_QUEUE,
    }),
  ],
  controllers: [ListsController],
  // providers: [ListsService, ListQueueProcessor, BoardService, BoardGateway],
  providers: [ListsService, ListQueueProcessor, BoardService],
})
export class ListsModule {}
