import { FileType } from './file.schema';

export class CreateFileDTO {
  key: string;
  url: string;
  type: FileType;
}
