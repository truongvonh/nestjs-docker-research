// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';
//
// class UnsplashUrl {
//   raw: string;
//   full: string;
//   regular: string;
//   small: string;
//   thumb: string;
// }
//
// @Schema({ timestamps: true })
// export class UnsplashModel extends Document {
//   @ApiProperty()
//   @Prop({ type: String, required: true })
//   alt_description: string;
//
//   @Prop({ type: UnsplashUrl, required: true })
//   urls: UnsplashUrl;
// }
//
// export const BoardSchema = SchemaFactory.createForClass(UnsplashModel);
