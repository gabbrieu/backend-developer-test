import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

@Injectable()
export class ArchiveJobUseCase {
    private readonly logger = new Logger(ArchiveJobUseCase.name);

    constructor(
        @Inject(FindOneJobUseCase)
        private readonly findOneJobUseCase: FindOneJobUseCase,

        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async execute(id: string): Promise<Job> {
        this.logger.log(`Archiving one job by id: ${id}`);

        const job: Job = await this.findOneJobUseCase.execute({
            where: { id },
            relations: { company: true },
        });

        if (job.status !== EJobStatus.PUBLISHED) {
            throw new ForbiddenException(
                `It is only possible to archive an active job (status flag = "published")`
            );
        }

        job.status = EJobStatus.ARCHIVED;

        return await this.saveJobUseCase.execute(job);
    }
}
