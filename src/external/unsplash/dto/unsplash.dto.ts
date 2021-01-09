import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderBy {
  latest = 'latest',
  oldest = 'oldest',
  popular = 'popular',
}

export class UnsplashQueryDTO {
  @IsString()
  @ApiProperty({
    example: '1',
  })
  readonly page: number;

  @IsString()
  @ApiProperty({
    example: '10',
  })
  readonly per_page: number;

  @IsString()
  @ApiProperty({
    example: OrderBy.latest,
  })
  readonly order_by: OrderBy;
}

export class UnsplashResponseDTO {}
