import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkspaceModel } from '../workspace/workspace.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class UserModel extends Document {
  @ApiProperty()
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  password: string;

  // @ApiProperty()
  @Prop({ type: [Types.ObjectId], ref: WorkspaceModel.name })
  workspaces: WorkspaceModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
