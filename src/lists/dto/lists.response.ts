import { AutoMap } from 'nestjsx-automapper';

export class ListsResponse {
  boardId: string;

  @AutoMap()
  _id!: string;

  @AutoMap(() => ListCard)
  cards!: ListCard[];

  @AutoMap()
  name!: string;
  order!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListCard {
  @AutoMap()
  _id!: string;

  @AutoMap()
  listId!: string;

  @AutoMap()
  name!: string;
  order!: number;
}
