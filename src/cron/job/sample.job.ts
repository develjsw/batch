import { Injectable } from '@nestjs/common';
import { SampleService } from '../service/sample.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SampleJob {
    constructor(private readonly sampleService: SampleService) {}

    @Cron('*/10 * * * * *')
    async handleSampleCron(): Promise<void> {
        await this.sampleService.run();
    }
}
