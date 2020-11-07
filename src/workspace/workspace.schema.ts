import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserModel } from '../users/user.schema';
import { BoardModel } from '../board/board.schema';

@Schema({ timestamps: true })
export class WorkspaceModel extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UserModel' })
  user: UserModel;

  @Prop({ type: [Types.ObjectId], ref: 'BoardModel' })
  board: BoardModel[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(WorkspaceModel);
