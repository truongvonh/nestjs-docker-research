import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { InjectModel } from '@nestjs/mongoose';
import { BoardModel } from './board.schema';
import { Request, Response } from 'express';
import { AddUserBoardDTO, CreateBoardDTO, QueryUserBoardDTO, UserBoardResponse } from './dto/board.dto';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { UserModel } from '../users/user.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { SUCCESS_MESSAGE } from '../constants/messages/success';
import { DeviceService } from '../device/device.service';
import { UsersService } from '../users/users.service';
import { BoardService } from './board.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BOARD_EVENT, BOARD_QUEUE } from './queue.constants';
import { notificationMessage } from './board.helper';
import { IPushDeviceQueuePayload } from './interfaces/queue.interface';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
    @InjectQueue(BOARD_QUEUE) private readonly boardQueue: Queue,
    private deviceService: DeviceService,
    private userService: UsersService,
    private boardService: BoardService,
  ) {}

  @ApiOperation({ summary: 'Create Board' })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  public async createBoard(@Body() createBoardDTO: CreateBoardDTO, @Res() res: Response) {
    Logger.debug(createBoardDTO);
    const owner = this.requestCtx.user._id;
    const newBoard = await new this.boardModel({
      ...createBoardDTO,
      owner,
      users: [owner],
    }).save();

    Logger.debug(newBoard._id);
    await this.userModel.findOneAndUpdate({ _id: owner }, { $push: { boards: newBoard._id } });

    return res.status(HttpStatus.OK).json(newBoard);
  }

  @Get(':userId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all my boards of the user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserBoardResponse })
  public async getAllMyBoards(
    @Param() param: QueryUserBoardDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { userId } = param;
    Logger.debug(param);

    const excludeBoard = { select: '-boards' };

    const response = await this.userModel
      .findOne({ _id: userId })
      .populate({
        path: 'boards',
        select: '-lists',
        populate: [
          {
            path: 'owner',
            ...excludeBoard,
          },
          {
            path: 'users',
            ...excludeBoard,
          },
        ],
      })
      .lean();

    return res.status(HttpStatus.OK).json(response);
  }

  @Put('/:boardId/user/:userId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Add new user to the board' })
  public async addUserBoard(
    @Body() addUserBoardDTO: AddUserBoardDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { userId, boardId } = addUserBoardDTO;

    const { _id: userAddId, name: userAddName } = this.requestCtx.user;

    const boardToAdd = await this.boardService.getBoardById(boardId);

    if (!boardToAdd.owner.equals(userAddId)) {
      throw new HttpException(ERRORS_MESSAGE.NOT_OBJECT_OWNER, HttpStatus.FORBIDDEN);
    }

    const userExist = await this.userService.getUserById(userId);

    const isExistUserInBoard = boardToAdd.users.includes(Types.ObjectId(userId));

    if (isExistUserInBoard) {
      throw new HttpException(ERRORS_MESSAGE.USER_EXISTED, HttpStatus.BAD_REQUEST);
    }

    await Promise.all([
      new this.boardModel(boardToAdd).update({
        $push: { users: Types.ObjectId(userId) },
      }),
      new this.userModel(userExist).update({
        $push: { boards: boardToAdd._id },
      }),
    ]);

    await this.boardQueue.add(BOARD_EVENT.PUSH_DEVICE_NOTIFICATION, {
      userId,
      content: notificationMessage(userAddName, boardToAdd.name),
    } as IPushDeviceQueuePayload);

    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.OK);
  }
}
