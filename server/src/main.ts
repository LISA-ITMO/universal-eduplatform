import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  // Allow configuring multiple origins via CORS_ORIGIN env (comma-separated), or '*' to allow all.
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  if (corsOrigin === '*') {
    app.enableCors({ origin: true, credentials: true });
  } else {
    const allowed = corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
    app.enableCors({
      origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // If no origin (curl, server-side), allow
        if (!requestOrigin) return callback(null, true);
        if (allowed.includes(requestOrigin)) return callback(null, true);
        // Not allowed
        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
    });
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();


