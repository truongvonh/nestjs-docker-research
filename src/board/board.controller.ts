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
import {
  AddUserBoardDTO,
  CreateBoardDTO,
  QueryUserBoardDTO,
  UserBoardResponse,
} from './dto/board.dto';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { BoardService } from './board.service';
import { UserModel } from '../users/user.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { SUCCESS_MESSAGE } from '../constants/messages/success';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
    @InjectModel(WorkspaceModel.name)
    private workspaceModel: Model<WorkspaceModel>,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
    private boardService: BoardService,
  ) {}

  @ApiOperation({ summary: 'Create Board' })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  public async createBoard(
    @Body() createBoardDTO: CreateBoardDTO,
    @Res() res: Response,
  ) {
    Logger.debug(createBoardDTO);
    const owner = this.requestCtx.user._id;
    const newBoard = await new this.boardModel({
      ...createBoardDTO,
      users: [owner],
    }).save();

    Logger.debug(newBoard._id);
    await this.userModel.findOneAndUpdate(
      { _id: owner },
      { $push: { boards: newBoard._id } },
    );

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

    const { _id: userAddId } = this.requestCtx.user;

    const boardToAdd = await this.boardModel.findOne({ _id: boardId });

    if (!boardToAdd) {
      throw new HttpException(
        ERRORS_MESSAGE.ENTITY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!boardToAdd.owner.equals(userAddId)) {
      throw new HttpException(
        ERRORS_MESSAGE.NOT_OBJECT_OWNER,
        HttpStatus.FORBIDDEN,
      );
    }

    const userExist = await this.userModel.findOne({ _id: userId });

    if (!userExist) {
      throw new HttpException(
        ERRORS_MESSAGE.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const isExistUserInBoard = boardToAdd.users.includes(
      Types.ObjectId(userId),
    );

    if (isExistUserInBoard) {
      throw new HttpException(
        ERRORS_MESSAGE.USER_EXISTED,
        HttpStatus.BAD_REQUEST,
      );
    }

    await Promise.all([
      new this.boardModel(boardToAdd).update({
        $push: { users: Types.ObjectId(userId) },
      }),
      new this.userModel(userExist).update({
        $push: { boards: boardToAdd._id },
      }),
    ]);

    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.OK);
  }
}
