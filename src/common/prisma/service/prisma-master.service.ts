import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma-master-client';

@Injectable()
export class PrismaMasterService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            datasources: {
                db: {
                    // TODO : Config 설정으로 변경
                    url: process.env.BATCH_MASTER_DATABASE_URL
                }
            },
            log: ['query', 'info', 'warn', 'error']
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async runInTransaction(callback: (prisma: PrismaClient) => Promise<any>) {
        return this.$transaction(callback);
    }
}
