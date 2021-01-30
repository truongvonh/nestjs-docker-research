import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListsDTO {
  @IsString()
  @ApiProperty({
    example: 'Board id',
    name: 'boardId',
  })
  readonly boardId: string;

  @IsString()
  @ApiProperty({
    example: 'Board name',
    name: 'name',
  })
  readonly name: string;
}

export class GetListParam {
  @IsString()
  @ApiProperty({
    name: 'boardId',
    example: 'Board Id',
  })
  readonly boardId: string;
}

export class UpdateListParamDTO {
  @IsString()
  @ApiProperty({
    example: 'List id',
    name: 'listId',
  })
  readonly listId: string;
}

export class UpdateListBodyDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'List name',
    name: 'name',
  })
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 'List order',
    name: 'order',
  })
  order?: number;
}
