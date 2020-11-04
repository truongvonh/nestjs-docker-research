import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.schema';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/auth.interface';
import { CookieOptions } from 'express';

export const SALT_LENGTH = 10;
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    registerDTO: RegisterDTO,
  ): Promise<UserModel | ExceptionInformation> {
    try {
      let registerUser = await this.userService.getUserByEmail(
        registerDTO.email,
      );

      if (registerUser) {
        throw new HttpException(
          ERRORS_MESSAGE.USER_EXISTED,
          HttpStatus.BAD_REQUEST,
        );
      }

      const password = await bcrypt.hash(registerDTO.password, SALT_LENGTH);
      registerUser = await this.userService.createNewUser({
        ...registerDTO,
        password,
      });

      registerUser.password = null;
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
    try {
      const userLogin = await this.userService.getUserByEmail(email);

      await this.verifyPassword(password, userLogin.password);

      userLogin.password = null;
      return userLogin;
    } catch (e) {
      throw new HttpException(
        ERRORS_MESSAGE.SOMETHING_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload = { userId } as ITokenPayload;
    const token = this.jwtService.sign(payload);

    const cookieOption: CookieOptions = {
      maxAge: +process.env.JWT_EXPIRATION_TIME,
      httpOnly: true,
    };

    return {
      cookieOption,
      token,
    };
  }
}
