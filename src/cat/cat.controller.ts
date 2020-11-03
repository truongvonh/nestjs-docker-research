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

@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @Get()
  async findAll(@Req() request: Request, @Res() res: Response) {
    res.status(HttpStatus.OK).json(await this.catService.findAll());
  }

  @Get(':id')
  getDetailCat(@Param() param): string {
    const { id } = param;
    return `find cat by ${id}`;
  }

  @Post()
  async createCat(@Body() catDTO: CreateCatDTO) {
    await this.catService.createCat(catDTO);
  }
}
