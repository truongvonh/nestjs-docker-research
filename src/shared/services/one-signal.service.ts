import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'onesignal-node';
import {
  ClientResponse,
  CreateNotificationBody,
} from 'onesignal-node/lib/types';

@Injectable()
export class OneSignalService {
  private oneSignal: Client;

  init() {
    this.oneSignal = new Client(
      process.env.ONESIGNAL_APP_ID,
      process.env.ONESIGNAL_REST_API_KEY,
    );
  }

  public createNotification(
    body: CreateNotificationBody,
  ): Promise<ClientResponse> {
    Logger.debug(`ONESIGNAL_APP_ID ${process.env.ONESIGNAL_APP_ID}`);

    Logger.debug(
      `ONESIGNAL_REST_API_KEY ${process.env.ONESIGNAL_REST_API_KEY}`,
    );

    return new Client(
      process.env.ONESIGNAL_APP_ID,
      process.env.ONESIGNAL_REST_API_KEY,
    ).createNotification(body);
  }
}
