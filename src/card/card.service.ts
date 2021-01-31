import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardModel } from './card.schema';
import { Model } from 'mongoose';

@Injectable()
export class CardService {
  constructor(@InjectModel(CardModel.name) private cardModel: Model<CardModel>) {}

  public async getNextOrderByList(listId: string) {
    return this.cardModel.find({ listId }).count();
  }
}
