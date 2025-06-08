import { SetMetadata } from '@nestjs/common';
import { RedisLockKeyEnum } from '../enum/redis-lock-key.enum';

export const REDIS_LOCK_METADATA = 'REDIS_LOCK_METADATA';

export function RedisLock(key: RedisLockKeyEnum, ttl: number): MethodDecorator {
    return SetMetadata(REDIS_LOCK_METADATA, { key, ttl });
}
