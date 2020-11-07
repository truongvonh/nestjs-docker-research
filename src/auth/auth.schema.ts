import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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

  @Prop({ type: Types.ObjectId, ref: UserModel.name })
  user: UserModel[];
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
