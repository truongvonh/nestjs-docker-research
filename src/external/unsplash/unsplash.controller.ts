import {
  Controller,
  Get,
  HttpService,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnsplashQueryDTO, UnsplashResponseDTO } from './dto/unsplash.dto';
import { Response } from 'express';
import { stringify } from 'query-string';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { UnsplashModel } from './model/unsplash.model';

@Controller('unsplash')
@ApiTags('Unsplash Endpoint')
export class UnsplashController {
  constructor(
    private httpService: HttpService,
    @InjectMapper() private readonly mapper: AutoMapper,
  ) {}

  // @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all unsplash image' })
  @Get()
  public async getAllPhotos(
    @Query() query: UnsplashQueryDTO,
    @Res() res: Response,
  ): Promise<Response<UnsplashResponseDTO>> {
    const parseQuery = stringify({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      ...query,
    });

    const { data } = await this.httpService
      .get(`/photos?${parseQuery}`)
      .toPromise();

    const mapperUnsplash = this.mapper.mapArray(
      data,
      UnsplashResponseDTO,
      UnsplashModel,
    );

    return res.status(HttpStatus.OK).json(mapperUnsplash);
  }
}
