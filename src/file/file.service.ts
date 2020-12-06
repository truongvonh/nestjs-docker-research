import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileModel } from './file.schema';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { CreateFileDTO } from './file.dto';
import { fromBuffer } from 'file-type';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel.name) private fileModel: Model<FileModel>,
    private readonly configService: ConfigService,
  ) {}

  public async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();

    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile: CreateFileDTO = {
      key: uploadResult.Key,
      url: uploadResult.Location,
      type: await fromBuffer(dataBuffer),
    };
    return new this.fileModel(newFile).save();
  }

  public async deletePublicFile(fileId: string) {
    const file = await this.fileModel.findOne({ _id: fileId });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: file.key,
      })
      .promise();

    await this.fileModel.deleteOne({ _id: fileId });
  }
}
