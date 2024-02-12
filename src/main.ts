import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true })).enableCors();

    const config = new DocumentBuilder()
        .setTitle('Backend Developer Technical Assessment')
        .setDescription('Backend Developer Technical Assessment API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const PORT = Number(process.env.PORT) || 3000;
    await app.listen(PORT, '0.0.0.0');
}

bootstrap();
