import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceModel, WorkspaceSchema } from './workspace.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceModel.name, schema: WorkspaceSchema },
    ]),
    UsersModule,
    // BoardModule,
  ],
  providers: [],
  exports: [WorkspaceModule],
})
export class WorkspaceModule {}
