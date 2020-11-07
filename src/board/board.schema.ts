import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';

@Schema({ timestamps: true })
export class BoardModel extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, required: true, default: false })
  isStar: boolean;

  @Prop({ type: Types.ObjectId, ref: 'WorkspaceModel' })
  workspace: WorkspaceModel;
}

export const BoardSchema = SchemaFactory.createForClass(BoardModel);
