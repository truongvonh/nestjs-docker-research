import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CardModel extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  description: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  order: number;

  @ApiProperty()
  @Prop([{ type: SchemaTypes.ObjectId, required: false }])
  users: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  listId: Types.ObjectId;

  @ApiProperty()
  @Prop([{ type: SchemaTypes.ObjectId, required: false }])
  attachments: Types.ObjectId[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.Date, required: false })
  dueDate: Date;
}

export const CardSchema = SchemaFactory.createForClass(CardModel);
