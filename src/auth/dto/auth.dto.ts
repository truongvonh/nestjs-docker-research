import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const example = {
  email: 'vonhattruong250695@gmail.com',
  password: '123qwe123qwe@',
  name: 'Vo Nhat Truong',
};

export class RegisterDTO {
  @ApiProperty({
    example: example.email,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: example.name,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: example.password,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
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
