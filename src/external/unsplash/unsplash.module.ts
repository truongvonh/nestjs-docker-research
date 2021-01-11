import { HttpModule, Module } from '@nestjs/common';
import { UnsplashController } from './unsplash.controller';
import './profiles/unsplash.profile';
import {
  AutomapperModule,
  CamelCaseNamingConvention,
  SnakeCaseNamingConvention,
} from 'nestjsx-automapper';

@Module({
  controllers: [UnsplashController],
  imports: [
    AutomapperModule.withMapper({
      sourceNamingConvention: SnakeCaseNamingConvention,
      destinationNamingConvention: CamelCaseNamingConvention,
    }),
    HttpModule.register({
      baseURL: process.env.UNSPLASH_API_ENDPOINT,
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
    }),
  ],
})
export class UnsplashModule {}
