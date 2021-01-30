import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoardModel } from '../board/board.schema';
import { Model, Types } from 'mongoose';
import { ListsModel } from './lists.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import {
  CreateListsDTO,
  GetListParam,
  UpdateListBodyDTO,
  UpdateListParamDTO,
} from './dto/lists.dto';
import { Response } from 'express';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { ListsService } from './lists.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { LIST_EVENT, LIST_QUEUE } from './queue.constants';
import { IUpdateListOrderByQueueDTO, ListUpdateDirectionEnum } from './list.interface';
import { LIST_ERROR_MESSAGE } from './contants/list.error';

@Controller('lists')
@ApiTags('Lists Endpoint')
export class ListsController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(ListsModel.name) private listsModel: Model<ListsModel>,
    @InjectQueue(LIST_QUEUE) private readonly listQueue: Queue,
    private listService: ListsService,
  ) {}

  private NEAR_POSITION: number = 1;

  @ApiOperation({ summary: 'Get all lists' })
  @UseGuards(JwtAuthenticationGuard)
  @Get(':boardId')
  public async getLists(
    @Param() queryListParam: GetListParam,
    @Res() res: Response,
  ): Promise<Response> {
    const { boardId } = queryListParam;

    const allLists = await this.listsModel.find({ boardId }, '-cards -boardId').lean();

    return res.status(HttpStatus.OK).json(allLists);
  }

  @ApiOperation({ summary: 'Create lists' })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  public async createList(
    @Body() createListDTO: CreateListsDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { boardId } = createListDTO;

    const boardExist = await this.boardModel.findOne({
      _id: Types.ObjectId(boardId),
    });

    if (!boardExist) {
      throw new HttpException(ERRORS_MESSAGE.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const nextOrder = await this.listService.getNextOrderByBoard(boardId);

    const newList = await new this.listsModel({
      ...createListDTO,
      order: nextOrder,
    }).save();

    await new this.boardModel(boardExist).update({
      $push: { lists: newList._id },
    });

    return res.status(HttpStatus.OK).json(newList);
  }

  @ApiOperation({ summary: 'Update lists' })
  @UseGuards(JwtAuthenticationGuard)
  @Put(':listId')
  public async updateList(
    @Param() updateListParamDTO: UpdateListParamDTO,
    @Body() updateListBodyDTO: UpdateListBodyDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { listId } = updateListParamDTO;
    const { order: newOrder, name: newName } = updateListBodyDTO;

    const listToUpdate = await this.listService.getListById(listId);
    const { order: currentOrder } = listToUpdate;

    if (newOrder) {
      const maxOrder = await this.listsModel.find({ boardId: listToUpdate.boardId }).count();

      if (newOrder > maxOrder) {
        throw new HttpException(LIST_ERROR_MESSAGE.ORDER_INVALID, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      if (
        newOrder === currentOrder + this.NEAR_POSITION ||
        currentOrder === newOrder + this.NEAR_POSITION
      ) {
        const listByNewOrder = await this.listsModel.findOne({ order: newOrder });
        await Promise.all([
          new this.listsModel(listToUpdate).updateOne({ $set: { order: newOrder } }),
          new this.listsModel(listByNewOrder).updateOne({ $set: { order: currentOrder } }),
        ]);
      }

      if (newOrder > currentOrder) {
        await this.listQueue.add(LIST_EVENT.UPDATE_LIST_ORDER_BY_DIRECTION, {
          listToUpdate,
          newOrder,
          direction: ListUpdateDirectionEnum.Left,
        } as IUpdateListOrderByQueueDTO);
      } else {
        await this.listQueue.add(LIST_EVENT.UPDATE_LIST_ORDER_BY_DIRECTION, {
          listToUpdate,
          newOrder,
          direction: ListUpdateDirectionEnum.Right,
        });
      }

      return res.status(HttpStatus.OK).json({ ...listToUpdate.toObject(), order: newOrder });
    }

    if (newName) {
      await new this.listsModel(listToUpdate).updateOne({ $set: { name: newName } });
      return res.status(HttpStatus.OK).json({ ...listToUpdate.toObject(), name: newName });
    }

    return res.status(HttpStatus.OK).json(listToUpdate);
  }
}
