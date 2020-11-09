import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../users/user.schema';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BoardModel } from '../board.schema';

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
