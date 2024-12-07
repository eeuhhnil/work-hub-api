import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigService>(ConfigService)

  // validation pipe
  app.useGlobalPipes(new ValidationPipe())

  // cors
  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
    credentials: true,
  })

  // Swagger document
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Work hub apis')
    .setDescription('The work hub management apis')
    .addServer(`http://localhost:${config.get('PORT')}`, `Development API[PORT=${config.get('PORT')}]`)
    .setVersion('1.0.0')
    .addBearerAuth({
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig, {deepScanRoutes: true})
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<number>('PORT') || 3000)

  return app.getUrl()
}
bootstrap().then((url) => {
  console.log(`Listening on ${url}`)
})