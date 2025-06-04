import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisLockModule } from './common/redis/lock/redis-lock.module';
import { CronModule } from './cron/cron.module';
import { LifecycleModule } from './core/lifecycle/lifecycle.module';

let envFile: string = 'env.local';
switch (process.env.NODE_ENV) {
    case 'production':
        envFile = 'env.production';
        break;
    case 'development':
        envFile = 'env.development';
        break;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [path.resolve(__dirname, `../${envFile}`)],
            isGlobal: true,
            cache: true
        }),
        PrismaModule,
        RedisLockModule,
        CronModule,
        LifecycleModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
