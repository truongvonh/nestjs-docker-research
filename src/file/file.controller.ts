import {
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { FileService } from './file.service';
import { REQUEST } from '@nestjs/core';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { SUCCESS_MESSAGE } from '../constants/messages/success';

@ApiTags('File Endpoint v1')
@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Upload file production' })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  public async uploadFile(@UploadedFile() file, @Res() res) {
    const result = await this.fileService.uploadPrivateFile(
      file.buffer,
      file.originalname,
    );

    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Delete upload file' })
  @UseInterceptors(FileInterceptor('file'))
  @Delete('/:id')
  public async deleteUploadFile(@Param('id') id: string, @Res() res) {
    await this.fileService.deletePrivateFile(id);
    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.DELETED);
  }
}
