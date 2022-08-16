import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Demo NestJs APIs')
    .setDescription('NestJs APIs')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'BearerAuth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/documentation', app, document);

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
