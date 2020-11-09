import { BoardModel } from '../board.schema';
import { UserModel } from '../../users/user.schema';

export interface IBoardByUserResponse {
  user: UserModel;
  boards: BoardModel[];
}

export interface IResponseData<T> {
  data: T;
}
