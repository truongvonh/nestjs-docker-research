import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LIST_EVENT, LIST_QUEUE } from './queue.constants';
import { IUpdateListOrderByQueueDTO, ListUpdateDirectionEnum } from './list.interface';
import { ListsService } from './lists.service';
import { InjectModel } from '@nestjs/mongoose';
import { ListsModel } from './lists.schema';
import { Model } from 'mongoose';

@Processor(LIST_QUEUE)
export class ListQueueProcessor {
  constructor(
    private listService: ListsService,
    @InjectModel(ListsModel.name) private listsModel: Model<ListsModel>,
  ) {}

  private readonly logger = new Logger(ListQueueProcessor.name);

  @Process(LIST_EVENT.UPDATE_LIST_ORDER_BY_DIRECTION)
  public async updateListOrderInLeftProcess(job: Job<IUpdateListOrderByQueueDTO>) {
    this.logger.debug(
      '================== LIST_EVENT.UPDATE_LIST_ORDER_BY_DIRECTION START ==================',
    );

    const { listToUpdate, newOrder } = job.data;
    const { first, last } = await this.listService.getParamsForListQueue(job.data);

    this.logger.debug(first);
    this.logger.debug(last);

    const listIdsForUpdate = await this.listService.getListIdsUpdate({
      first,
      last,
      listToUpdate,
      direction: ListUpdateDirectionEnum.Left,
    });

    await this.listService.updateListByDirection({
      listIdsForUpdate,
      listToUpdate,
      newOrder,
      direction: ListUpdateDirectionEnum.Left,
    });

    this.logger.debug(
      '================== LIST_EVENT.UPDATE_LIST_ORDER_BY_DIRECTION END ==================',
    );
  }
}
