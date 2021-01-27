import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.schema';
import { CreateUserDTO } from './dto/user.dto';
import { ERRORS_MESSAGE } from '../constants/messages/errors';

export const isEmptyObject = (obj: object): boolean => !Object.keys(obj).length;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async getUserByEmail(email): Promise<UserModel> {
    const user = this.userModel.findOne({ email });

    if (isEmptyObject(user)) {
      throw new HttpException(
        ERRORS_MESSAGE.NOT_FOUND_USER_BY_EMAIL,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async createNewUser(createUserDTO: CreateUserDTO): Promise<UserModel> {
    return new this.userModel(createUserDTO).save();
  }

  public async getById(userId: string) {
    const user = this.userModel.findOne({ _id: userId });

    if (isEmptyObject(user)) {
      throw new HttpException(
        ERRORS_MESSAGE.NOT_FOUND_USER_BY_EMAIL,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserById(userId): Promise<UserModel> {
    const userExist = await this.userModel.findOne({ _id: userId });

    if (!userExist) {
      throw new HttpException(
        ERRORS_MESSAGE.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return userExist;
  }
}
