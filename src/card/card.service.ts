import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardModel } from './card.schema';
import { Model, Types } from 'mongoose';
import { ERRORS_CARD_MESSAGE } from './constants/error.card';
import { IRangeForCardUpdate, IUpdateCardOrderParam } from './dto/card.dto';
import { CardUpdateDirectionEnum } from './constants/card.enum';
import { ListUpdateDirectionEnum } from '../lists/list.interface';

@Injectable()
export class CardService {
  constructor(@InjectModel(CardModel.name) private cardModel: Model<CardModel>) {}

  public async getNextOrderByList(listId: string) {
    return this.cardModel.find({ listId }).count();
  }

  public async checkCardExistById(cardId: string) {
    const existCard = this.cardModel.findOne({ _id: Types.ObjectId(cardId) });

    if (!existCard) {
      throw new HttpException(ERRORS_CARD_MESSAGE.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return existCard;
  }

  public async getMaxOrderByListId(listId: string): Promise<number> {
    return this.cardModel.find({ listId }).count();
  }

  public async getRangeForCardOrderUpdate({ cardToUpdate, newOrder }: IRangeForCardUpdate) {
    const allCardByListId = await this.cardModel
      .find({ listId: cardToUpdate.listId })
      .sort({ order: 1 })
      .lean();

    const firstTmp = allCardByListId.findIndex(({ order }) => order === cardToUpdate.order);
    const lastTmp = allCardByListId.findIndex(({ order }) => order === newOrder);

    return {
      last: lastTmp > firstTmp ? lastTmp : firstTmp,
      first: firstTmp < lastTmp ? firstTmp : lastTmp,
    };
  }

  public async getListCardIdsForUpdate({ last, first, cardToUpdate, direction }) {
    const checkSkipByDirection = direction === CardUpdateDirectionEnum.Top ? first + 1 : first;

    const arrayList = await this.cardModel
      .find({ listId: cardToUpdate.listId })
      .sort({ order: 1 })
      .skip(checkSkipByDirection)
      .limit(last - first);

    return arrayList.map(({ _id }) => _id);
  }

  public async updateCardByDirection({ idsCardUpdate, newOrder, direction, cardToUpdate }) {
    const checkOrderByDirection = direction === CardUpdateDirectionEnum.Top ? -1 : 1;

    await this.cardModel.update(
      { _id: { $in: idsCardUpdate }, listId: cardToUpdate.listId },
      { $inc: { order: checkOrderByDirection } },
      { multi: true },
    );
    await new this.cardModel(cardToUpdate).update({ $set: { order: newOrder } });
  }

  public async updateCardOrderByDirection({
    direction,
    cardToUpdate,
    newOrder,
  }: IUpdateCardOrderParam) {
    const { first, last } = await this.getRangeForCardOrderUpdate({ cardToUpdate, newOrder });

    const idsCardUpdate = await this.getListCardIdsForUpdate({
      last,
      first,
      cardToUpdate,
      direction,
    });

    await this.updateCardByDirection({ idsCardUpdate, newOrder, direction, cardToUpdate });
  }
}
