import { Body, Controller, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardModel } from './card.schema';
import { ListsModel } from '../lists/lists.schema';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import { CreateCardDTO, UpdateCardBodyDTO, UpdateCardParamDTO } from './dto/card.dto';
import { Response } from 'express';
import { ListsService } from '../lists/lists.service';
import { CardService } from './card.service';
import { BoardGateway } from '../board/board.gateway';
import { CARD_SOCKET_EMIT_EVENT } from './constants/card.socket';

@Controller('card')
@ApiTags('Card Endpoint')
export class CardController {
  constructor(
    @InjectModel(CardModel.name) private cardModel: Model<CardModel>,
    @InjectModel(ListsModel.name) private listModel: Model<ListsModel>,
    private listService: ListsService,
    private boardGateway: BoardGateway,
    private cardService: CardService,
  ) {}

  @ApiOperation({ summary: 'Create new card' })
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  public async createCard(
    @Body() createCardDTO: CreateCardDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { listId } = createCardDTO;

    await this.listService.checkListExistById(listId);

    const nextOrderByList = await this.cardService.getNextOrderByList(listId);

    const newCard = await new this.cardModel({ ...createCardDTO, order: nextOrderByList }).save();

    const list = await this.listModel.findOne({ _id: newCard.listId });

    this.boardGateway.server
      .to(list.toObject().boardId.toString())
      .emit(CARD_SOCKET_EMIT_EVENT.NEW_CARD, { listId, newCard });

    return res.status(HttpStatus.OK).json();
  }

  @ApiOperation({ summary: 'Update card' })
  @Put(':cardId')
  @UseGuards(JwtAuthenticationGuard)
  public async updateCard(
    @Param() updateCardParamDTO: UpdateCardParamDTO,
    @Body() updateCardBodyDTO: UpdateCardBodyDTO,
    @Res() res: Response,
  ) {
    const { listId } = updateCardBodyDTO;

    return;
  }
}
