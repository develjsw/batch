import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SampleService } from '../service/sample.service';

@Injectable()
export class SampleJob {
    constructor(private readonly sampleService: SampleService) {}

    @Cron('*/30 * * * * *')
    async handleSampleCron(): Promise<void> {
        await this.sampleService.getSampleData();
    }
}
