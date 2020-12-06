import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
  url: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  key: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
