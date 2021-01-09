import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

const PORT = process.env.APP_PORT || 8000;

const corsArr = ['http://localhost:3000', 'https://trello-clone.dev'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: corsArr, credentials: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // disableErrorMessages: true,
      validationError: {
        value: false,
      },
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Nestjs learning API')
    .setDescription('Nestjs learning API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Mongo(),
    ],
  });

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(PORT);

  Logger.log(`Server start with port: ${PORT}`);
}

bootstrap();
