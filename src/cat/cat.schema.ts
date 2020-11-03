import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CatModel extends Document {
  @Prop() name: string;

  @Prop() age: number;

  @Prop() breed: string;
}

export const CatSchema = SchemaFactory.createForClass(CatModel);
