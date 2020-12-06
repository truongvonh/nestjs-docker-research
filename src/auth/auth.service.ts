import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserTokenDTO, RegisterDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/auth.interface';
import { CookieOptions } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthModel } from './auth.schema';

export const SALT_LENGTH = 10;
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(AuthModel.name) private authModel: Model<AuthModel>,
  ) {}

  async addUserToken(createAuthDTO: CreateUserTokenDTO) {
    await new this.authModel(createAuthDTO).save();
  }

  async updateUserToken(newAccessToken: string, userId: string) {
    await this.authModel.findOneAndUpdate(
      {
        user: userId,
      },
      { accessToken: newAccessToken },
    );
  }

  async registerUser(
    registerDTO: RegisterDTO,
  ): Promise<UserModel | ExceptionInformation> {
    let registerUser = await this.userService.getUserByEmail(registerDTO.email);

    if (registerUser) {
      throw new HttpException(
        ERRORS_MESSAGE.USER_EXISTED,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const accessToken = await bcrypt.hash(registerDTO.password, SALT_LENGTH);
      registerUser = await this.userService.createNewUser(registerDTO);

      await this.addUserToken({ user: registerUser._id, accessToken });

      return registerUser;
    } catch (e) {
      throw new HttpException(
        ERRORS_MESSAGE.SOMETHING_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async verifyPassword(password, hashPassword): Promise<void> {
    const isMatchPassword = await bcrypt.compare(password, hashPassword);

    if (!isMatchPassword) {
      throw new HttpException(
        ERRORS_MESSAGE.PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserModel> {
    Logger.debug(email);
    const userLogin = await this.userService.getUserByEmail(email);

    if (!userLogin) {
      throw new HttpException(
        ERRORS_MESSAGE.NOT_FOUND_USER_BY_EMAIL,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userAuth = await this.authModel.findOne({ user: userLogin._id });

    if (!userAuth) {
      throw new HttpException(
        ERRORS_MESSAGE.PASSWORD_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.verifyPassword(password, userAuth.accessToken);

    return userLogin;
  }

  public getCookieWithJwtToken(userId: string) {
    const payload = { userId } as ITokenPayload;
    const token = this.jwtService.sign(payload);

    const cookieOption: CookieOptions = {
      maxAge: +process.env.JWT_EXPIRATION_TIME,
      httpOnly: false,
      secure: false,
    };

    return {
      cookieOption,
      token,
    };
  }

  public async removeUserToken(userId: string) {
    await this.authModel.findOneAndDelete({ user: userId });
  }
}
