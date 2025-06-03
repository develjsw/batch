import { Injectable } from '@nestjs/common';
import { PrismaSlaveService } from '../../../common/prisma/service/prisma-slave.service';

@Injectable()
export class GetSampleQuery {
    constructor(private readonly prisma: PrismaSlaveService) {}

    async findSampleData(): Promise<any> {
        return {
            sampleId: 1,
            sampleData: 'sampleData'
        };
    }
}
