import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ShutdownHandler implements BeforeApplicationShutdown {
    private readonly callbacks: Array<() => Promise<void>> = [];

    registerCallback(callback: () => Promise<void>): void {
        this.callbacks.push(callback);
    }

    async beforeApplicationShutdown(): Promise<void> {
        console.log('[ShutdownHandler] 애플리케이션 종료 훅 실행됨');

        const processTaskResult: PromiseSettledResult<void>[] = await Promise.allSettled(
            this.callbacks.map((callback: () => Promise<void>): Promise<void> => callback())
        );

        processTaskResult.forEach((result: PromiseSettledResult<void>, index: number): void => {
            if (result.status === 'rejected') {
                console.error(`[ShutdownHandler] 콜백 ${index} 실패:`, result.reason);
            }
        });

        console.log('[ShutdownHandler] 모든 shutdown 콜백 완료');
    }
}
