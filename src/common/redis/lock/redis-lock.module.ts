import { Global, Module } from '@nestjs/common';
import { RedisLockManagerService } from './service/redis-lock-manager.service';
import { RedisLockProvider } from './provider/redis-lock.privider';
import Redlock from 'redlock';

@Global()
@Module({
    providers: [
        {
            provide: Redlock,
            useClass: RedisLockProvider
        },
        RedisLockManagerService
    ],
    exports: [Redlock, RedisLockManagerService]
})
export class RedisLockModule {}
