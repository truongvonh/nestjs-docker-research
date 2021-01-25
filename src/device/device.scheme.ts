import { Document, SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false })
export class DeviceModel extends Document {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  receiveId: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: true })
  deviceToken: string;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceModel);
