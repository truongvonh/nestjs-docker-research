import { Injectable, Logger } from '@nestjs/common';
import { OneSignalService } from '../shared/services/one-signal.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceModel } from './device.scheme';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import * as Sentry from '@sentry/node';

@Injectable()
export class DeviceService {
  constructor(
    private oneSignalService: OneSignalService,
    @InjectModel(DeviceModel.name) private deviceModel: Model<DeviceModel>,
  ) {}

  public async pushNotificationToListDevice(entityId: string): Promise<void> {
    try {
      Logger.debug(entityId);

      const listDevice: DeviceModel[] = await this.deviceModel.find({
        receiveId: Types.ObjectId(entityId),
      });

      if (!listDevice.length) {
        return;
      }

      const listDeviceIds = listDevice.map(({ deviceToken }) => deviceToken);

      const notificationPayload = {
        headings: {
          en: 'Test upload Continue',
        },
        contents: {
          en: 'Push notification success!',
        },
        include_player_ids: listDeviceIds,
      } as CreateNotificationBody;

      const response = await this.oneSignalService.createNotification(
        notificationPayload,
      );
      Logger.debug(response);
    } catch (e) {
      Logger.debug(`e: ${e}`);
      Sentry.captureException(e);
    }
  }
}
