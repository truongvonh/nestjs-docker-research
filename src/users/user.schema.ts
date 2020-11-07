import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';

@Schema({ timestamps: true })
export class UserModel extends Document {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  name: number;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [Types.ObjectId], ref: WorkspaceModel.name })
  workspaces: WorkspaceModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
