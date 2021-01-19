import { Injectable } from '@nestjs/common';
import { CachingService } from '../database/redis/redis.service';
import { CACHE_KEY_USER_BOARD } from './constants/cache.key';
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

  public async getWorkSpaceByUser(userId: string): Promise<WorkspaceModel[]> {
    return this.workspaceModel.find({ user: Types.ObjectId(userId) }).populate({
      path: 'board',
      populate: [
        {
          path: 'owner',
        },
        {
          path: 'users',
        },
      ],
    });
  }
}
