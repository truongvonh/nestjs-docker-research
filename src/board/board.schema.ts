import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Urls } from '../external/unsplash/model/unsplash.model';
import { UserModel } from '../users/user.schema';

@Schema({ _id: false })
export class UrlModel extends Document {
  @ApiProperty()
  @Prop({ type: String, required: false })
  raw: string;
  @ApiProperty()
  @Prop({ type: String, required: false })
  full: string;
  @ApiProperty()
  @Prop({ type: String, required: false })
  regular: string;
  @ApiProperty()
  @Prop({ type: String, required: false })
  small: string;
  @ApiProperty()
  @Prop({ type: String, required: false })
  thumb: string;
}

@Schema({ timestamps: true })
export class BoardModel extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: false })
  isStar: boolean;

  @ApiProperty()
  @Prop({ type: UrlModel, required: false, default: {} })
  urls: Urls;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserModel' })
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop([{ type: SchemaTypes.ObjectId, ref: 'UserModel' }])
  users: Types.ObjectId[];
}

export const BoardSchema = SchemaFactory.createForClass(BoardModel);
