import { IsNumberString } from 'class-validator';

export class DeleteFileDTO {
  @IsNumberString() id: string;
}
