import {
  Controller,
  Get,
  HttpService,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnsplashQueryDTO, UnsplashResponseDTO } from './dto/unsplash.dto';
import JwtAuthenticationGuard from '../../auth/guard/jwt.guard';
import { Response } from 'express';
import { stringify } from 'query-string';
import { AxiosResponse } from 'axios';

@Controller('unsplash')
@ApiTags('Unsplash Endpoint')
export class UnsplashController {
  constructor(private httpService: HttpService) {}

  @ApiOperation({ summary: 'Get all unsplash image' })
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async getAllPhotos(
    @Query() query: UnsplashQueryDTO,
    @Res() res: Response,
  ): Promise<UnsplashResponseDTO> {
    const parseQuery = stringify({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      ...query,
    });
    const imageUnsplash: AxiosResponse = await this.httpService
      .get(`/photos?${parseQuery}`)
      .toPromise();

    return res.status(HttpStatus.OK).json(imageUnsplash.data);
  }
}
