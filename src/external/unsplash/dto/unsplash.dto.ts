import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'nestjsx-automapper';
import { Urls } from '../model/unsplash.model';

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
  readonly page: string;

  @IsString()
  @ApiProperty({
    example: '10',
  })
  readonly per_page: string;

  @IsString()
  @ApiProperty({
    example: OrderBy.latest,
  })
  readonly order_by: OrderBy;
}

export class UnsplashResponseDTO {
  @AutoMap()
  description: string;

  @AutoMap()
  created_at: Date;
  // @AutoMap()
  // alt_description: string;
}
