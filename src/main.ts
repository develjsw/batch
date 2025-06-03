import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule);

    const configService: ConfigService = app.get(ConfigService);

    await app.listen(+configService.get('SERVER_PORT'));
}
bootstrap();
