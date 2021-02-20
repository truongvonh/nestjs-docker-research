import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardModel } from '../card/card.schema';

@Schema({ timestamps: true })
export class ListsModel extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  order: number;

  @ApiProperty()
  @Prop([{ type: SchemaTypes.ObjectId, required: false, ref: CardModel.name }])
  cards: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  boardId: Types.ObjectId;
}

export const ListsSchema = SchemaFactory.createForClass(ListsModel);
