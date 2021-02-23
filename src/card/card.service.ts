import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardModel } from './card.schema';
import { Model, Types } from 'mongoose';
import { ERRORS_CARD_MESSAGE } from './constants/error.card';
import { IRangeForCardUpdate, IUpdateCardOrderParam } from './dto/card.dto';
import { CardUpdateDirectionEnum } from './constants/card.enum';

enum ListTypeEnum {
  Target = 'Target',
  Source = 'Source',
}

@Injectable()
export class CardService {
  constructor(@InjectModel(CardModel.name) private cardModel: Model<CardModel>) {}
  public NOT_FOUND_INDEX = -1;

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

  public async getListOrderCard(listId) {
    return this.cardModel
      .find({ listId })
      .sort({ order: 1 })
      .lean();
  }

  public async getRangeForCardOrderUpdate({ cardToUpdate, newOrder }: IRangeForCardUpdate) {
    const allCardByListId = await this.getListOrderCard(cardToUpdate.listId);

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

  public async getCardIdsByList({ listId, updateOrder, listType }) {
    const allListCardId = await this.getListOrderCard(listId);

    const first = allListCardId.findIndex(({ order }) => order === updateOrder);
    const last = allListCardId.length - 1;

    if (first === this.NOT_FOUND_INDEX) {
      return [];
    }

    const getLength = last - first;
    const checkSkip = listType === ListTypeEnum.Source ? first + 1 : first;
    const checkLimit = listType === ListTypeEnum.Source ? getLength : getLength + 1;

    const allCardUpdate = await this.cardModel
      .find({ listId })
      .sort({ order: 1 })
      .skip(checkSkip)
      .limit(checkLimit)
      .lean();

    return allCardUpdate.map(({ _id }) => _id);
  }

  public async updateCardOrderInDifferentList({
    listTargetId,
    newOrder,
    currentOrder,
    listSourceId,
  }) {
    const [idsSource, idsTarget] = await Promise.all([
      this.getCardIdsByList({
        listId: listSourceId,
        updateOrder: currentOrder,
        listType: ListTypeEnum.Source,
      }),
      this.getCardIdsByList({
        listId: listTargetId,
        updateOrder: newOrder,
        listType: ListTypeEnum.Target,
      }),
    ]);

    await Promise.all([
      this.updateCardOrderByDirection({
        direction: CardUpdateDirectionEnum.Top,
        listId: listSourceId,
        idsCardUpdate: idsSource,
      }),
      this.updateCardOrderByDirection({
        direction: CardUpdateDirectionEnum.Bottom,
        idsCardUpdate: idsTarget,
        listId: listTargetId,
      }),
    ]);
  }

  public async updateCardOrderByDirection({ direction, listId, idsCardUpdate }) {
    if (!idsCardUpdate.length) {
      return;
    }

    const checkOrderByDirection = direction === CardUpdateDirectionEnum.Top ? -1 : 1;

    await this.cardModel.update(
      { _id: { $in: idsCardUpdate }, listId },
      { $inc: { order: checkOrderByDirection } },
      { multi: true },
    );
  }

  public async updateCardOrderInSameList({
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

    await this.updateCardOrderByDirection({
      direction,
      listId: cardToUpdate.listId,
      idsCardUpdate,
    });
  }
}
