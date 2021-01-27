import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../users/user.schema';
import { DeviceModel, DeviceSchema } from './device.scheme';
import { DeviceService } from './device.service';
import { OneSignalService } from '../shared/services/one-signal.service';

@Module({
  controllers: [DeviceController],
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: DeviceModel.name, schema: DeviceSchema },
    ]),
  ],
  providers: [DeviceService, OneSignalService],
})
export class DeviceModule {}
