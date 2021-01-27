import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BOARD_EVENT, BOARD_QUEUE } from './queue.constants';
import { IPushDeviceQueuePayload } from './interfaces/queue.interface';
import { DeviceService } from '../device/device.service';

@Processor(BOARD_QUEUE)
export class BoardQueueProcessor {
  constructor(private deviceService: DeviceService) {}

  private readonly logger = new Logger(BoardQueueProcessor.name);

  @Process(BOARD_EVENT.PUSH_DEVICE_NOTIFICATION)
  public async handleTranscode(job: Job<IPushDeviceQueuePayload>) {
    this.logger.debug('Start transcoding...');
    const { userId, content } = job.data;
    await this.deviceService.pushNotificationToListDevice(userId, content);

    this.logger.debug('Completed transcoding...');
  }
}
