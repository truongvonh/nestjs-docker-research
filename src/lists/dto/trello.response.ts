import { AutoMap } from 'nestjsx-automapper';

export class Lanes {
  @AutoMap()
  id!: string;

  @AutoMap()
  title!: string;

  label!: string;
  style!: Style;

  @AutoMap(() => TrelloCard)
  cards!: TrelloCard[];
}

export class TrelloCard {
  @AutoMap()
  id!: string;

  @AutoMap()
  title!: string;

  @AutoMap()
  label!: string;
  description!: string;

  @AutoMap()
  laneId!: string;
}

export class Style {
  width!: number;
}
