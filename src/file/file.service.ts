import {
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileModel } from './file.schema';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { CreatePrivateFileDTO } from './file.dto';
import { fromBuffer } from 'file-type';
import { REQUEST } from '@nestjs/core';
import { IUserRequest } from '../auth/interfaces/auth.interface';
import { Request } from 'express';
import { ERRORS_MESSAGE } from '../constants/messages/errors';

@Injectable()
export class FileService {
  private s3Object = new S3();

  constructor(
    @InjectModel(FileModel.name) private fileModel: Model<FileModel>,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private requestCtx: IUserRequest & Request,
  ) {}

  public async getPrivateFile(fileId: number) {
    const fileInfo = await this.fileModel.findOne({ id: fileId });

    if (!fileInfo) {
      throw new NotFoundException();
    }

    const stream = await this.s3Object
      .getObject({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Key: fileInfo.key,
      })
      .createReadStream();

    return {
      stream,
      info: fileInfo,
    };
  }

  public async generatePreSignedUrl(key: string) {
    return this.s3Object.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
      Key: key,
    });
  }

  async uploadPrivateFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3Object
      .upload({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    Logger.debug(uploadResult);

    const fileToUpload: CreatePrivateFileDTO = {
      key: uploadResult.Key,
      owner: this.requestCtx.user._id,
      type: await fromBuffer(dataBuffer),
    };

    const fileUploaded = await this.fileModel.create(fileToUpload);

    return this.generatePreSignedUrl(fileUploaded.key);
  }

  async deletePrivateFile(fileId: string) {
    const fileUploaded = await this.fileModel.findOne({
      _id: fileId,
    });

    if (!fileUploaded) {
      throw new NotFoundException();
    }

    if (!this.requestCtx.user._id.equals(fileUploaded.owner)) {
      throw new NotAcceptableException(ERRORS_MESSAGE.NOT_OBJECT_OWNER);
    }

    await this.fileModel.findOneAndDelete({ _id: fileUploaded._id });

    await this.s3Object
      .deleteObject({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Key: fileUploaded.key,
      })
      .promise();
  }
}
