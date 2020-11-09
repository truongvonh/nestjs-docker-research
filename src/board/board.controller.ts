import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { InjectModel } from '@nestjs/mongoose';
import { BoardModel } from './board.schema';
import { Request, Response } from 'express';
import {
  CreateBoardDTO,
  QueryUserBoardDTO,
  UserBoardResponse,
} from './dto/board.dto';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';
import { CreateWorkspaceDTO } from '../workspace/dto/workspace.dto';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { BoardService } from './board.service';
import { IBoardCache } from './interfaces/board-cache.interface';
import { UserModel } from '../users/user.schema';

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
    const newBoard = await new this.boardModel(createBoardDTO).save();

    const workspace = {
      user: this.requestCtx.user._id,
      board: newBoard._id,
    } as CreateWorkspaceDTO;

    const newWorkspace = await new this.workspaceModel(workspace).save();

    await this.boardService.updateBoardCaching({
      user: this.requestCtx.user,
      board: newBoard,
      workspace: newWorkspace,
    } as IBoardCache);

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

    const [workspaces, user] = await Promise.all([
      this.boardService.getWorkSpaceByUser(userId),
      this.userModel.findOne({ _id: Types.ObjectId(userId) }).lean(),
    ]);

    const response = {
      ...user,
      boards: workspaces.map(({ board }) => board),
    };

    await this.boardService.cachingUserBoards(user._id, response);

    return res.status(HttpStatus.OK).json(response);
  }
}
