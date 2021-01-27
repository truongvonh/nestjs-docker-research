import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { BoardModel } from './board.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
  ) {}

  public async getBoardById(
    boardId: string | Types.ObjectId,
  ): Promise<BoardModel> {
    const boardExist = await this.boardModel.findOne({ _id: boardId });

    if (!boardExist) {
      throw new HttpException(
        ERRORS_MESSAGE.ENTITY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return boardExist;
  }
}
