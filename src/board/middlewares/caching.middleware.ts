import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { CachingService } from '../../database/redis/redis.service';
import { IUserBoardRequest } from '../../auth/interfaces/auth.interface';
import { CACHE_KEY_USER_BOARD } from '../constants/cache.key';
import { Request, Response } from 'express';

@Injectable()
export class CachingUserBoardMiddleware implements NestMiddleware {
  constructor(private readonly cachingService: CachingService) {}

  async use(
    req: IUserBoardRequest & Request,
    res: Response,
    next: () => void,
  ): Promise<Response | void> {
    try {
      const { userId } = req.params;
      const userBoardCache = await this.cachingService.getParse(
        CACHE_KEY_USER_BOARD(userId),
      );

      if (!userBoardCache) {
        return next();
      }

      res.status(HttpStatus.OK).json(userBoardCache);
    } catch (e) {
      next();
    }
  }
}
