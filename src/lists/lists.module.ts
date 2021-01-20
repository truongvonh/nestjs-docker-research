import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from '../board/board.schema';
import { ListsModel, ListsSchema } from './lists.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoardModel.name, schema: BoardSchema },
      { name: ListsModel.name, schema: ListsSchema },
    ]),
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
