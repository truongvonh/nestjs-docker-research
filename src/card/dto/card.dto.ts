import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsNumber()
  @ApiProperty({
    example: 'Card order',
    name: 'order',
  })
  @IsOptional()
  readonly order: number;

  @IsString()
  @ApiProperty({
    example: 'Card name',
    name: 'name',
  })
  @IsOptional()
  readonly name: string;
}

export class UpdateCardParamDTO {
  @IsString()
  @ApiProperty({
    example: '601426d30d816c0116221870',
    name: 'cardId',
  })
  readonly cardId: string;
}
