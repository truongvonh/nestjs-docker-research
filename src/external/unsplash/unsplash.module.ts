import { HttpModule, Module } from '@nestjs/common';
import { UnsplashController } from './unsplash.controller';

@Module({
  controllers: [UnsplashController],
  imports: [
    HttpModule.register({
      baseURL: process.env.UNSPLASH_API_ENDPOINT,
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
    }),
  ],
})
export class UnsplashModule {}
