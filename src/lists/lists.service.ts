import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ListsModel } from './lists.schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(ListsModel.name)
    private listsModel: Model<ListsModel>,
  ) {}

  public async getNextOrderByBoard(boardId: string): Promise<number> {
    return this.listsModel.find({ boardId: Types.ObjectId(boardId) }).count();
  }
}
