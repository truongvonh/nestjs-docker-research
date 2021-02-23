import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CardModel } from './card.schema';
import { ListsModel } from '../lists/lists.schema';
import JwtAuthenticationGuard from '../auth/guard/jwt.guard';
import {
  CreateCardDTO,
  IUpdateCardOrderParam,
  UpdateCardBodyDTO,
  UpdateCardOrderBodyDTO,
  UpdateCardParamDTO,
} from './dto/card.dto';
import { Response } from 'express';
import { ListsService } from '../lists/lists.service';
import { CardService } from './card.service';
import { CARD_SOCKET_EMIT_EVENT } from './constants/card.socket';
import { SocketService } from '../shared/socket/socket.service';
import { ERRORS_CARD_MESSAGE } from './constants/error.card';
import { CardUpdateDirectionEnum } from './constants/card.enum';
import { SUCCESS_MESSAGE } from '../constants/messages/success';

@Controller('card')
@ApiTags('Card Endpoint')
export class CardController {
  constructor(
    @InjectModel(CardModel.name) private cardModel: Model<CardModel>,
    @InjectModel(ListsModel.name) private listModel: Model<ListsModel>,
    private listService: ListsService,
    private cardService: CardService,
    private socketService: SocketService,
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

    await new this.listModel(list).update({ $push: { cards: newCard._id } });

    this.socketService.socket
      .to(list.toObject().boardId.toString())
      .emit(CARD_SOCKET_EMIT_EVENT.NEW_CARD, { listId, newCard });

    return res.status(HttpStatus.OK).json();
  }

  @ApiOperation({ summary: 'Update card order' })
  @Put(':cardId/order')
  @UseGuards(JwtAuthenticationGuard)
  public async updateCardOrder(
    @Param() updateCardParamDTO: UpdateCardParamDTO,
    @Body() updateCardOrderBodyDTO: UpdateCardOrderBodyDTO,
    @Res() res: Response,
  ) {
    const { cardId } = updateCardParamDTO;
    const { sourceListId, targetListId, order: newOrder } = updateCardOrderBodyDTO;

    const existCard = await this.cardService.checkCardExistById(cardId);

    const maxOrder = await this.cardService.getMaxOrderByListId(targetListId);

    if (newOrder > maxOrder) {
      throw new HttpException(ERRORS_CARD_MESSAGE.ORDER_INVALID, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (sourceListId !== targetListId) {
      await Promise.all([
        this.listModel.findOneAndUpdate(
          { _id: Types.ObjectId(sourceListId), cards: { $in: [existCard._id] } },
          { $pull: { cards: existCard._id } },
        ),
        this.listModel.findOneAndUpdate(
          { _id: Types.ObjectId(targetListId) },
          { $push: { cards: existCard._id } },
        ),
        new this.cardModel(existCard).update({ listId: targetListId }),
      ]);
      existCard.listId = Types.ObjectId(targetListId);
      existCard.order = newOrder;
    } else {
      const updateOrderParam = {
        direction: CardUpdateDirectionEnum.Top,
        newOrder,
        cardToUpdate: existCard,
      } as IUpdateCardOrderParam;

      if (newOrder > existCard.order) {
        await this.cardService.updateCardOrderByDirection(updateOrderParam);
      } else {
        await this.cardService.updateCardOrderByDirection({
          ...updateOrderParam,
          direction: CardUpdateDirectionEnum.Bottom,
        });
      }

      await new this.cardModel(existCard).update({ $set: { order: newOrder } });
    }

    return res.status(HttpStatus.OK).json(SUCCESS_MESSAGE.OK);
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
