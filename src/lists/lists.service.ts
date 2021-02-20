import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ListsModel } from './lists.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import {
  IGetListIdsForUpdate,
  IUpdateListOrderByQueueDTO,
  IUpdateListQueueResponse,
  ListUpdateDirectionEnum,
} from './list.interface';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(ListsModel.name)
    private listsModel: Model<ListsModel>,
  ) {}

  public async getNextOrderByBoard(boardId: string): Promise<number> {
    return this.listsModel.find({ boardId: Types.ObjectId(boardId) }).count();
  }

  public async checkListExistById(listId: string): Promise<ListsModel> {
    const existList = await this.listsModel.findOne({ _id: Types.ObjectId(listId) });

    if (!existList) {
      throw new HttpException(ERRORS_MESSAGE.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return existList;
  }

  public async getParamsForListQueue({
    listToUpdate,
    newOrder,
  }: IUpdateListOrderByQueueDTO): Promise<IUpdateListQueueResponse> {
    const allListByBoard = await this.listsModel
      .find({ boardId: listToUpdate.boardId })
      .sort({ order: 1 })
      .lean();

    const firstTemp = allListByBoard.findIndex(({ order }) => order === listToUpdate.order);
    const lastTemp = allListByBoard.findIndex(({ order }) => order === newOrder);

    return {
      last: lastTemp > firstTemp ? lastTemp : firstTemp,
      first: firstTemp < lastTemp ? firstTemp : lastTemp,
    };
  }

  public async getListIdsUpdate({
    last,
    first,
    listToUpdate,
    direction = ListUpdateDirectionEnum.Left,
  }: IGetListIdsForUpdate): Promise<Types.ObjectId[]> {
    const checkStartByDirection = direction === ListUpdateDirectionEnum.Left ? first + 1 : first;

    const arrayList = await this.listsModel
      .find({ boardId: listToUpdate.boardId })
      .sort({ order: 1 })
      .skip(checkStartByDirection)
      .limit(last - first);

    return arrayList.map(({ _id }) => _id);
  }

  public async updateListByDirection({ listIdsForUpdate, listToUpdate, newOrder, direction }) {
    const checkOrderByDirection = direction === ListUpdateDirectionEnum.Left ? -1 : 1;

    await this.listsModel.update(
      { _id: { $in: listIdsForUpdate }, boardId: listToUpdate.boardId },
      { $inc: { order: checkOrderByDirection } },
      { multi: true },
    );
    await new this.listsModel(listToUpdate).update({ $set: { order: newOrder } });
  }
}
