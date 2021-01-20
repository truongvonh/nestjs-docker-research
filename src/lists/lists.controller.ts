import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoardModel } from '../board/board.schema';
import { Model, Types } from 'mongoose';
import { ListsModel } from './lists.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { CreateListsDTO, GetListParam } from './dto/lists.dto';
import { Response } from 'express';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { ListsService } from './lists.service';

@Controller('lists')
@ApiTags('Lists Endpoint')
export class ListsController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(ListsModel.name) private listsModel: Model<ListsModel>,
    private listService: ListsService,
  ) {}

  @ApiOperation({ summary: 'Get all lists' })
  @Get(':boardId')
  public async getLists(
    @Param() queryListParam: GetListParam,
    @Res() res: Response,
  ): Promise<Response> {
    const { boardId } = queryListParam;

    const allLists = await this.listsModel
      .find({ boardId }, '-cards -boardId')
      .lean();

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
      throw new HttpException(
        ERRORS_MESSAGE.ENTITY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const nextOrder = await this.listService.getNextOrderByBoard(boardId);

    const newList = await new this.listsModel({
      ...createListDTO,
      order: nextOrder,
    }).save();

    await new this.boardModel(boardExist).update({
      $push: { lists: newList._id },
    });

    return res.status(HttpStatus.OK).json();
  }
}
