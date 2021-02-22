import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CardModel, CardSchema } from './card.schema';
import { ListsModel, ListsSchema } from '../lists/lists.schema';
import { ListsService } from '../lists/lists.service';
import { CardService } from './card.service';
import { LabelModule } from './label/label.module';
import { ChecklistModule } from './checklist/checklist.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardModel.name, schema: CardSchema },
      { name: ListsModel.name, schema: ListsSchema },
    ]),
    LabelModule,
    ChecklistModule,
  ],
  controllers: [CardController],
  providers: [ListsService, CardService],
})
export class CardModule {}
