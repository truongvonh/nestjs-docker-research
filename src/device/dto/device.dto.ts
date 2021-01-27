import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceDTO {
  @IsString()
  @ApiProperty({
    example: 'OneSignal Id',
    name: 'deviceToken',
  })
  readonly deviceToken: string;
}
