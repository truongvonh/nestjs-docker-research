import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class BoardModel extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: false })
  isStar: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(BoardModel);
