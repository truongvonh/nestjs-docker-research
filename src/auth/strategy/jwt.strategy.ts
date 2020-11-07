import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ITokenPayload } from '../interfaces/auth.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies[`${process.env.COOKIE_AUTH_KEY}`] || '';
        },
      ]),
      secretOrKey: process.env.JWT_SECRECT,
    });
  }

  async validate(payload: ITokenPayload) {
    return this.userService.getById(payload.userId);
  }
}
