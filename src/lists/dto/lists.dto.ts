import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListsDTO {
  @IsString()
  @ApiProperty({
    example: '6025142d1113df001e4ef32c',
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
    example: '6025142d1113df001e4ef32c',
  })
  readonly boardId: string;
}

export enum ParseTrelloListEnum {
  Yes = 'Yes',
  No = 'No',
}

export class GetListQuery {
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'parseTrello',
    example: ParseTrelloListEnum.No,
    enum: ParseTrelloListEnum,
  })
  readonly parseTrello?: ParseTrelloListEnum;
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
