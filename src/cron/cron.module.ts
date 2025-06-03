import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SampleJob } from './job/sample.job';
import { SampleService } from './service/sample.service';
import { CreateSampleCommand } from './repository/command/create-sample.command';
import { GetSampleQuery } from './repository/query/get-sample.query';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [SampleJob, SampleService, CreateSampleCommand, GetSampleQuery]
})
export class CronModule {}
