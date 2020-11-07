import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const example = {
  email: 'vonhattruong250695@gmail.com',
  password: '123qwe123qwe@',
};

export class RegisterDTO {
  @ApiProperty({
    example: example.email,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Vo Nhat Truong',
  })
  readonly name: string;

  @ApiProperty({
    example: example.password,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserLoginDTO {
  @ApiProperty({
    example: example.email,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: example.password,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
