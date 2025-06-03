import { Injectable } from '@nestjs/common';
import { PrismaMasterService } from '../../../common/prisma/service/prisma-master.service';

@Injectable()
export class CreateSampleCommand {
    constructor(private readonly prisma: PrismaMasterService) {}
}
