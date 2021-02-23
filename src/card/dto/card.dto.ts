import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CardUpdateDirectionEnum } from '../constants/card.enum';
import { CardModel } from '../card.schema';

export class CreateCardDTO {
  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'listId',
  })
  readonly listId: string;

  @IsString()
  @ApiProperty({
    example: 'New card',
    name: 'name',
  })
  readonly name: string;
}

export class UpdateCardBodyDTO {
  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'listId',
  })
  readonly listId: string;

  @IsString()
  @ApiProperty({
    example: 'card description',
    name: 'description',
  })
  @IsOptional()
  readonly description: string;

  @IsString()
  @ApiProperty({
    example: 'Card name',
    name: 'name',
  })
  @IsOptional()
  readonly name: string;
}

export class UpdateCardOrderBodyDTO {
  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'sourceListId',
  })
  readonly sourceListId: string;

  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'targetListId',
  })
  readonly targetListId: string;

  @IsNumber()
  @ApiProperty({
    example: 'Card order',
    name: 'order',
  })
  readonly order: number;
}

export class UpdateCardParamDTO {
  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'cardId',
  })
  readonly cardId: string;
}

export interface IRangeForCardUpdate {
  cardToUpdate: CardModel;
  newOrder: number;
}

export interface IUpdateCardOrderParam {
  direction: CardUpdateDirectionEnum;
  cardToUpdate: CardModel;
  newOrder: number;
}
