import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { InjectModel } from '@nestjs/mongoose';
import { BoardModel } from './board.schema';
import { Request, Response } from 'express';
import { CreateBoardDTO } from './dto/board.dto';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';
import { CreateWorkspaceDTO } from '../workspace/dto/workspace.dto';
import { IUserRequest } from '../auth/interfaces/auth.interface';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(
    @InjectModel(BoardModel.name) private boardModel: Model<BoardModel>,
    @InjectModel(WorkspaceModel.name)
    private workspaceModel: Model<WorkspaceModel>,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
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

    await new this.workspaceModel(workspace).save();

    return res.status(HttpStatus.OK).json();
  }
}
