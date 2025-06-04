import { ShutdownHandler } from '../handler/shutdown.handler';

export abstract class BaseBatchService {
    private currentJob: Promise<void> | null = null;
    private isShuttingDown = false;

    protected constructor(private readonly shutdownHandler: ShutdownHandler) {
        shutdownHandler.registerCallback(this.onShutdown.bind(this));
    }

    /**
     * 외부에서 배치 작업을 시작하는 진입점 메서드
     */
    async run(): Promise<void> {
        if (this.isShuttingDown || this.currentJob) return; // 중복 실행 또는 종료 중이면 무시

        this.currentJob = this.executeLogic();

        try {
            await this.currentJob;
        } finally {
            this.currentJob = null;
        }
    }

    /**
     * 애플리케이션 종료 시 현재 진행 중인 작업이 있다면 완료될 때까지 대기
     */
    private async onShutdown(): Promise<void> {
        this.isShuttingDown = true;
        console.log(`[${this.constructor.name}] 종료 감지됨`);

        if (this.currentJob) {
            console.log(`[${this.constructor.name}] 진행중인 작업 대기 중...`);
            await this.currentJob;
        }

        console.log(`[${this.constructor.name}] 안전하게 종료 완료`);
    }

    /**
     * 실제 배치 로직 구현부 - 하위 클래스에서 구현
     */
    protected abstract executeLogic(): Promise<void>;
}
