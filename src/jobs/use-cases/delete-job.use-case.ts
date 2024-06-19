import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { EJobStatus, Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';
import { FindOneJobUseCase } from './find-one-job.use-case';

@Injectable()
export class DeleteJobUseCase {
    private readonly logger = new Logger(DeleteJobUseCase.name);

    constructor(
        @Inject(FindOneJobUseCase)
        private readonly findOneJobUseCase: FindOneJobUseCase,

        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(id: string): Promise<void> {
        this.logger.log(`Deleting one job by id: ${id}`);

        const job: Job = await this.findOneJobUseCase.execute({
            where: { id },
        });

        if (job.status !== EJobStatus.DRAFT) {
            throw new ForbiddenException(
                `It is only possible to delete a job with "draft" status`
            );
        }

        await this.jobRepository.delete({ id: job.id });
    }
}
