import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import Redlock, { Lock } from 'redlock';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { REDIS_LOCK_METADATA } from '../decorator/redis-lock.decorator';
import { RedisLockKeyEnum } from '../enum/redis-lock-key.enum';
import { REDIS_LOCK_PREFIX } from '../constant/redis-lock.constant';

@Injectable()
export class RedisLockManagerService {
    private readonly usedKeys = new Set<string>();

    constructor(
        private readonly redLock: Redlock,

        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly reflector: Reflector
    ) {}

    public applyRedisLocks(): void {
        const instances: InstanceWrapper[] = this.getAllStaticNestInstances();

        instances.forEach(({ instance }: InstanceWrapper) => {
            const prototype = Object.getPrototypeOf(instance);
            const methodNames: string[] = this.metadataScanner.getAllMethodNames(prototype);

            methodNames.forEach((methodName: string): void => {
                this.wrapMethodWithRedisLock(instance, prototype, methodName);
            });
        });
    }

    private getAllStaticNestInstances(): InstanceWrapper[] {
        return [...this.discoveryService.getControllers(), ...this.discoveryService.getProviders()]
            .filter((wrapper: InstanceWrapper): boolean => wrapper.isDependencyTreeStatic())
            .filter(({ instance }) => !!instance && Object.getPrototypeOf(instance));
    }

    private wrapMethodWithRedisLock(instance: any, prototype: object, methodName: string): void {
        const methodRef = prototype[methodName];
        const meta = this.reflector.get<{ key: RedisLockKeyEnum; ttl: number }>(REDIS_LOCK_METADATA, methodRef);

        if (!meta) return;

        const { key, ttl } = meta;
        const redisKey = this.buildRedisLockKey(key);

        if (this.usedKeys.has(redisKey)) {
            throw new ConflictException(`Duplicate redisLock key detected : "${redisKey}"`);
        }

        this.usedKeys.add(redisKey);

        const wrapped = async (...args: unknown[]): Promise<void> => {
            await this.runTaskWithLock(key, ttl, async (): Promise<void> => {
                await methodRef.call(instance, ...args);
            });
        };

        Object.setPrototypeOf(wrapped, methodRef);
        instance[methodName] = wrapped;
    }

    private buildRedisLockKey(key: RedisLockKeyEnum): string {
        return `${REDIS_LOCK_PREFIX}:${key}`;
    }

    async runTaskWithLock(key: RedisLockKeyEnum, ttl: number, task: () => Promise<void>): Promise<void> {
        let lock: Lock;

        try {
            lock = await this.redLock.acquire([this.buildRedisLockKey(key)], ttl);
            await task();
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                `An error occurred while executing the Redis-locked task for key "${key}"`
            );
        } finally {
            if (lock) {
                await lock.release();
            }
        }
    }
}
