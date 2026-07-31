import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart'; // 1. Importa el plugin
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Registra el plugin de multipart para procesar FormData y archivos
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // Opcional: límite de tamaño por archivo (ej. 10MB)
    },
  });

  // Registrar archivos estáticos
  await app.register(fastifyStatic, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/', // Debe coincidir con la URL pública
    decorateReply: true, // Asegura que decore la respuesta correctamente
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();