import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    example: 'board name',
  })
  readonly name: string;
}
