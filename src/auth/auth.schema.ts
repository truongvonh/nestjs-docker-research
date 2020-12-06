import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserModel } from '../users/user.schema';

export const ROLE = {
  USER: 'USER',
  OWNER: 'OWNER',
};

@Schema({ timestamps: true })
export class AuthModel extends Document {
  @Prop({ type: String, enum: [ROLE.USER, ROLE.OWNER], default: ROLE.USER })
  role: string;

  @Prop({ type: String })
  accessToken: string;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: UserModel.name })
  user: Types.ObjectId;
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
