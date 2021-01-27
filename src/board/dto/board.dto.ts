import { IsNotEmpty, IsObject, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../users/user.schema';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BoardModel } from '../board.schema';

class UrlsDTO {
  @IsString()
  raw?: string;
  @IsString()
  full?: string;
  @IsString()
  regular?: string;
  @IsString()
  small?: string;
  @IsString()
  thumb?: string;
}

export class CreateBoardDTO {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    example: 'board name',
  })
  readonly name: string;

  @IsObject()
  @ApiProperty({
    example: {
      raw:
        'https://images.unsplash.com/photo-1610979089729-26d1cb2ead07?ixid=MXwxOTcxODZ8MHwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1',
      full:
        'https://images.unsplash.com/photo-1610979089729-26d1cb2ead07?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxOTcxODZ8MHwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1&q=85',
      regular:
        'https://images.unsplash.com/photo-1610979089729-26d1cb2ead07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxOTcxODZ8MHwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=1080',
      small:
        'https://images.unsplash.com/photo-1610979089729-26d1cb2ead07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxOTcxODZ8MHwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400',
      thumb:
        'https://images.unsplash.com/photo-1610979089729-26d1cb2ead07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxOTcxODZ8MHwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=200',
    },
  })
  readonly urls: UrlsDTO;
}

export class QueryUserBoardDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5fa56aed55cf1b8e7e7d5780',
  })
  readonly userId: string;
}

export class UserBoardResponse {
  @ApiModelProperty({ type: UserModel })
  user: UserModel;
  @ApiModelProperty({ type: [BoardModel] })
  boards: BoardModel[];
}

export class AddUserBoardDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5fa56aed55cf1b8e7e7d5780',
    name: 'userId',
  })
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5fa56aed55cf1b8e7e7d5780',
    name: 'boardId',
  })
  readonly boardId: string;
}
