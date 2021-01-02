import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, UserLoginDTO } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local.guard';
import JwtAuthenticationGuard from './guard/jwt.guard';
import { IUserRequest } from './interfaces/auth.interface';
import { SUCCESS_MESSAGE } from '../constants/messages/success';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  async registerUser(@Body() registerDTO: RegisterDTO, @Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({
      data: await this.authService.registerUser(registerDTO),
    });
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @Post('login')
  public async login(@Body() userLoginDTO: UserLoginDTO, @Res() res: Response) {
    const { email, password } = userLoginDTO;

    const validUser = await this.authService.getAuthenticatedUser(
      email,
      password,
    );

    const { token, cookieOption } = this.authService.getCookieWithJwtToken(
      validUser.id,
    );

    res.cookie(process.env.COOKIE_AUTH_KEY, token, cookieOption);

    return res.status(HttpStatus.OK).json(validUser);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get user info' })
  @Get('user-info')
  public async getUserInfo(
    @Req() request: IUserRequest & Request,
    @Res() res: Response,
  ) {
    Logger.debug(request.user);
    return res.status(HttpStatus.OK).json(request.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'User logout' })
  @Post('log-out')
  public async userLogout(
    @Req() request: IUserRequest & Request,
    @Res() res: Response,
  ) {
    Logger.debug(request.user);
    res.clearCookie(process.env.COOKIE_AUTH_KEY);

    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.OK);
  }
}
