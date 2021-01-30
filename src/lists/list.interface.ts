import { ListsModel } from './lists.schema';

export interface IUpdateListOrderByQueueDTO {
  listToUpdate: ListsModel;
  newOrder: number;
  direction: ListUpdateDirectionEnum;
}

export interface IUpdateListQueueResponse {
  first: number;
  last: number;
}

export enum ListUpdateDirectionEnum {
  Left = 'Left',
  Right = 'Right',
}

export interface IGetListIdsForUpdate extends IUpdateListQueueResponse {
  listToUpdate: ListsModel;
  direction: ListUpdateDirectionEnum;
}
