import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, UserLoginDTO } from './dto/auth.dto';
import { Response } from 'express';
import { LocalStrategy } from './local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() registerDTO: RegisterDTO, @Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({
      data: await this.authService.registerUser(registerDTO),
    });
  }

  @HttpCode(200)
  @UseGuards(LocalStrategy)
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
  }
}
