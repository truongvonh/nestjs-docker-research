import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BoardModel } from '../board/board.schema';

@Schema({ timestamps: true })
export class UserModel extends Document {
  @ApiProperty()
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop([{ type: SchemaTypes.ObjectId, ref: BoardModel.name }])
  boards: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
