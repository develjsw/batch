import Redlock from 'redlock';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisLockProvider extends Redlock {
    constructor(configService: ConfigService) {
        const redisHost: string = configService.get<string>('REDIS_HOST');
        const redisPort: number = configService.get<number>('REDIS_PORT');

        const redis: Redis = new Redis({
            host: redisHost,
            port: redisPort
        });

        super([redis]);
    }
}
