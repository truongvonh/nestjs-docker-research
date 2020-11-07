import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModel, BoardSchema } from './board.schema';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BoardModel.name, schema: BoardSchema }]),
    WorkspaceModule,
  ],
})
export class BoardModule {}
