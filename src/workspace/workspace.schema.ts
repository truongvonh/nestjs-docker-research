import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserModel } from '../users/user.schema';
import { BoardModel } from '../board/board.schema';

@Schema({ timestamps: true })
export class WorkspaceModel extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserModel' })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: BoardModel.name })
  board: Types.ObjectId;
}

export const WorkspaceSchema = SchemaFactory.createForClass(WorkspaceModel);
