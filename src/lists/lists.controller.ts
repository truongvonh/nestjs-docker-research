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
import { Model } from 'mongoose';
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
import { ListsService } from './lists.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { LIST_ERROR_MESSAGE } from './contants/list.error';
import { LIST_EVENT, LIST_QUEUE } from './queue.constants';
import { IUpdateListOrderByQueueDTO, ListUpdateDirectionEnum } from './list.interface';
import { BoardService } from '../board/board.service';
import { LIST_EMIT_EVENT } from './contants/list.socket';
import { BoardGateway } from '../board/board.gateway';

@Controller('lists')
@ApiTags('Lists Endpoint')
export class ListsController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(ListsModel.name) private listsModel: Model<ListsModel>,
    @InjectQueue(LIST_QUEUE) private readonly listQueue: Queue,
    private listService: ListsService,
    private boardService: BoardService,
    private boardGateway: BoardGateway,
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

    await this.boardService.checkExistBoardById(boardId);

    const nextOrder = await this.listService.getNextOrderByBoard(boardId);

    const newList = await new this.listsModel({
      ...createListDTO,
      order: nextOrder,
    }).save();

    this.boardGateway.server.to(boardId).emit(LIST_EMIT_EVENT.CREATED_LIST, newList);

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

    const listToUpdate = await this.listService.checkListExistById(listId);
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
        } as IUpdateListOrderByQueueDTO);
      }

      listToUpdate.order = newOrder;
    }

    if (newName) {
      await new this.listsModel(listToUpdate).updateOne({ $set: { name: newName } });
      listToUpdate.name = newName;
    }

    this.boardGateway.server
      .to(listToUpdate.toObject().boardId.toString())
      .emit(LIST_EMIT_EVENT.UPDATED_LIST, listToUpdate);

    return res.status(HttpStatus.OK).json(listToUpdate);
  }
}
