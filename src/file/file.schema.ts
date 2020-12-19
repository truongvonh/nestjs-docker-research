import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../users/user.schema';

export class FileType {
  ext: string;
  mime: string;
}

@Schema({ timestamps: true })
export class FileModel extends Document {
  @ApiProperty()
  @Prop({ type: FileType, required: true })
  type: FileType;

  @ApiProperty()
  @Prop({ type: String, required: true })
  key: string;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: UserModel.name, required: true })
  owner: Types.ObjectId;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
