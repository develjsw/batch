import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redlock, { Lock } from 'redlock';
import { RedisLockKeyEnum } from '../enum/redis-lock-key.enum';

@Injectable()
export class RedisLockManagerService {
    constructor(private readonly redLock: Redlock) {}

    async runTaskWithLock(key: RedisLockKeyEnum, ttl: number, task: () => Promise<void>): Promise<void> {
        let lock: Lock;

        try {
            lock = await this.redLock.acquire([`batch-server:lock:${key}`], ttl);
            await task();
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(`Lock 작업 중 오류 발생 (${key})`);
        } finally {
            if (lock) {
                await lock.release();
            }
        }
    }
}
