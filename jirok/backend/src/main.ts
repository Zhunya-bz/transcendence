import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { default as cookieParser } from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { WebSocketServer } from 'ws';
import { ProjectRealtimeService } from './realtime/project-realtime.service';

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
    process.exit(1);
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Jirok API')
    .setDescription('Backend API documentation for Jirok')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const realtime = app.get(ProjectRealtimeService);
  const httpServer = app.getHttpServer();
  const websocketServer = new WebSocketServer({
    server: httpServer,
    path: '/ws/projects',
  });

  realtime.attachServer(websocketServer);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
