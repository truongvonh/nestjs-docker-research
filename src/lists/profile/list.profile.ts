import { AutoMapper, mapFrom, Profile, ProfileBase } from 'nestjsx-automapper';
import { ListCard, ListsResponse } from '../dto/lists.response';
import { Lanes, TrelloCard } from '../dto/trello.response';

@Profile()
export class ListProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper
      .createMap(ListCard, TrelloCard)
      .forMember(
        des => des.id,
        mapFrom(src => src._id),
      )
      .forMember(
        des => des.title,
        mapFrom(src => src.name),
      )
      .forMember(
        des => des.laneId,
        mapFrom(src => src.listId),
      );

    mapper.createMap(ListsResponse, Lanes);
  }
}
