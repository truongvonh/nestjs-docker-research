import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cat')
export class CatController {
  @Get()
  findAll(@Req() request: Request, @Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }

  @Get(':id')
  getDetailCat(@Param() param): string {
    const { id } = param;
    return `find cat by ${id}`;
  }
}
