import { Injectable } from '@nestjs/common';
import { GetSampleQuery } from '../repository/query/get-sample.query';
import { RedisLockManagerService } from '../../common/redis/lock/service/redis-lock-manager.service';
import { RedisLockKeyEnum } from '../../common/redis/lock/enum/redis-lock-key.enum';

@Injectable()
export class SampleService {
    constructor(
        private readonly getSampleQuery: GetSampleQuery,
        private readonly redisLockManagerService: RedisLockManagerService
    ) {}

    async getSampleData(): Promise<void> {
        await this.redisLockManagerService.runTaskWithLock(
            RedisLockKeyEnum.SAMPLE_JOB,
            1000 * 21,
            async (): Promise<void> => {
                console.log(await this.getSampleQuery.findSampleData());
            }
        );
    }
}
