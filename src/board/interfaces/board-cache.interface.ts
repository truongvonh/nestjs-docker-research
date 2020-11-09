import { UserModel } from '../../users/user.schema';
import { BoardModel } from '../board.schema';

export interface IBoardCache {
  user: UserModel;
  board: BoardModel;
}

export interface IUserBoardResponse extends UserModel {
  boards: BoardModel[];
}

export interface IBoardCacheData extends BoardModel {
  users: UserModel[];
}
