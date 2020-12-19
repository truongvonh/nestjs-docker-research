import { FileType } from './file.schema';
import { Types } from 'mongoose';

export class CreateFileDTO {
  key: string;
  url: string;
  type: FileType;
}

export class CreatePrivateFileDTO {
  key: string;
  type: FileType;
  owner: Types.ObjectId;
}
