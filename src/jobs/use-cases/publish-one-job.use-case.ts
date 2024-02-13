import { Inject, Injectable } from '@nestjs/common';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

@Injectable()
export class PublishOneJobUseCase {
    constructor(
        @Inject(FindOneJobUseCase)
        private readonly findOneJobUseCase: FindOneJobUseCase,

        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async execute(id: string): Promise<Job> {
        const job: Job = await this.findOneJobUseCase.execute({
            where: { id },
            relations: { company: true },
        });

        job.status = EJobStatus.PUBLISHED;

        return await this.saveJobUseCase.execute(job);
    }
}
