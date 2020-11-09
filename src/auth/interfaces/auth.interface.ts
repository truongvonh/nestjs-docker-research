import { UserModel } from '../../users/user.schema';

export interface ITokenPayload {
  userId: string;
}

export interface IUserRequest {
  user: UserModel;
}

export interface IUserBoardRequest {
  params: {
    userId: string;
  };
}
