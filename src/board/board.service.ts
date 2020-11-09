import { Injectable } from '@nestjs/common';
import { CachingService } from '../database/redis/redis.service';
import {
  IBoardCache,
  IBoardCacheData,
  IUserBoardResponse,
} from './interfaces/board-cache.interface';
import {
  CACHE_KEY_BOARD_USER,
  CACHE_KEY_USER_BOARD,
} from './constants/cache.key';
import { Model, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BoardService {
  constructor(
    private readonly cachingService: CachingService,
    @InjectModel(WorkspaceModel.name)
    private workspaceModel: Model<WorkspaceModel>,
  ) {}

  public async updateBoardCaching(boardCache: IBoardCache): Promise<void> {
    const { user, board } = boardCache;

    const userBoardKey = CACHE_KEY_USER_BOARD(user._id);
    const boardUserKey = CACHE_KEY_BOARD_USER(board._id);

    const [userBoardCache, boardUserCache] = await Promise.all([
      this.cachingService.getParse<IUserBoardResponse>(userBoardKey),
      this.cachingService.getParse<IBoardCacheData>(boardUserKey),
    ]);

    if (userBoardCache) {
      await this.cachingService.set(userBoardKey, {
        ...userBoardCache,
        boards: [...userBoardCache.boards, board],
      });
    }

    if (boardUserCache) {
      await this.cachingService.set(boardUserKey, {
        ...boardUserCache,
        users: [...boardUserCache.users, user],
      });
    }
  }

  public async getWorkSpaceByUser(userId: string): Promise<WorkspaceModel[]> {
    return this.workspaceModel
      .find({ user: Types.ObjectId(userId) })
      .populate('board');
  }

  public async cachingUserBoards(userId: string, cacheData): Promise<void> {
    const isExistKey = await this.cachingService.existKey(
      CACHE_KEY_USER_BOARD(userId),
    );

    if (isExistKey) {
      return;
    }

    await this.cachingService.set(CACHE_KEY_USER_BOARD(userId), cacheData);
  }
}
