import { Injectable } from '@nestjs/common';
import { GetSampleQuery } from '../repository/query/get-sample.query';
import { RedisLockKeyEnum } from '../../common/redis/lock/enum/redis-lock-key.enum';
import { ShutdownHandler } from '../../core/lifecycle/handler/shutdown.handler';
import { BaseBatchService } from '../../core/lifecycle/abstract/base-batch-service.abstract';
import { RedisLock } from '../../common/redis/lock/decorator/redis-lock.decorator';

@Injectable()
export class SampleService extends BaseBatchService {
    constructor(
        shutdownHandler: ShutdownHandler,

        private readonly getSampleQuery: GetSampleQuery
    ) {
        super(shutdownHandler);
    }

    @RedisLock(RedisLockKeyEnum.SAMPLE_JOB, 1000 * 21)
    protected async executeLogic(): Promise<void> {
        const nowDate = () => new Date().toISOString();
        console.log('[SampleService] 작업 시작:', nowDate());

        await new Promise((resolve) => setTimeout(resolve, 1000 * 10));

        console.log('Process - 1');

        console.log(await this.getSampleQuery.findSampleData());

        await new Promise((resolve) => setTimeout(resolve, 1000 * 10));

        console.log('Process - 2');

        console.log('[SampleService] 작업 완료:', nowDate());
    }
}
