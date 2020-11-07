import { forwardRef, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from './board.schema';
import { WorkspaceModule } from '../workspace/workspace.module';
import { BoardController } from './board.controller';
import { WorkspaceModel, WorkspaceSchema } from '../workspace/workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoardModel.name, schema: BoardSchema },
      { name: WorkspaceModel.name, schema: WorkspaceSchema },
    ]),
  ],
  controllers: [BoardController],
})
export class BoardModule {}
