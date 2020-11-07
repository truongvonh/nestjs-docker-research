import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceModel, WorkspaceSchema } from './workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceModel.name, schema: WorkspaceSchema },
    ]),
    // UsersModule,
    // BoardModule,
  ],
  providers: [],
  exports: [WorkspaceModule],
})
export class WorkspaceModule {}
