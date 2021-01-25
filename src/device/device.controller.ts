import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceModel } from './device.scheme';
import { RegisterDeviceDTO } from './dto/device.dto';
import { REQUEST } from '@nestjs/core';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { ERRORS_MESSAGE } from '../constants/messages/errors';
import { SUCCESS_MESSAGE } from '../constants/messages/success';

@ApiTags('Device Endpoint')
@Controller('device')
export class DeviceController {
  constructor(
    @InjectModel(DeviceModel.name)
    private notificationModel: Model<DeviceModel>,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
  ) {}

  @ApiOperation({ summary: 'Register User device' })
  @UseGuards(JwtAuthenticationGuard)
  @Post('/register')
  public async getLists(
    @Body() registerDeviceDTO: RegisterDeviceDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { deviceToken } = registerDeviceDTO;
    const { _id: receiveId } = this.requestCtx.user;

    const isExistDeviceToken = await this.notificationModel.findOne({
      deviceToken,
    });

    if (isExistDeviceToken) {
      throw new HttpException(
        ERRORS_MESSAGE.DEVICE_REGISTER,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await new this.notificationModel({
      ...registerDeviceDTO,
      receiveId,
    }).save();

    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.OK);
  }
}
