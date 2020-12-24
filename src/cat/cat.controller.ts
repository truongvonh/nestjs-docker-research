import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CatService } from './cat.service';
import { CreateCatDTO } from './dto/cat.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cat')
@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Forbidden.' })
  @Get()
  async findAll(@Req() request: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      data: await this.catService.findAll(),
    });
  }

  @Get(':id')
  getDetailCat(@Param() param): string {
    const { id } = param;
    return `find cat by ${id}`;
  }

  @Post()
  async createCat(@Body() catDTO: CreateCatDTO, @Res() res: Response) {
    return res.status(HttpStatus.CREATED).json({
      data: await this.catService.createCat(catDTO),
    });
  }
}
c