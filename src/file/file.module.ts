import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from './file.schema';
import { ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
  ],
  providers: [FileService, ConfigService],
  controllers: [FileController],
})
export class FileModule {}
