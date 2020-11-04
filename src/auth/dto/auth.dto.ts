import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
