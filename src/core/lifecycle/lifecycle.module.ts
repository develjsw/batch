import { Global, Module } from '@nestjs/common';
import { ShutdownHandler } from './handler/shutdown.handler';

@Global()
@Module({
    providers: [ShutdownHandler],
    exports: [ShutdownHandler]
})
export class LifecycleModule {}
