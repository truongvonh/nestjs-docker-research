import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatModel, CatSchema } from './cat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CatModel.name, schema: CatSchema }]),
  ],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
