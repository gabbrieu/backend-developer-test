import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UpdateJobDTO } from '../dto/update-job.dto';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

@Injectable()
export class UpdateJobUseCase {
    constructor(
        @Inject(FindOneJobUseCase)
        private readonly findOneJobUseCase: FindOneJobUseCase,

        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async execute(id: string, updateDTO: UpdateJobDTO): Promise<Job> {
        const job: Job = await this.findOneJobUseCase.execute({
            where: { id },
        });

        if (job.status !== EJobStatus.DRAFT) {
            throw new ForbiddenException(
                `It is only possible to update a job with "draft" status`
            );
        }

        // Not using spread operator because linear time complexity and to avoid extra props
        job.title = updateDTO.title ?? job.title;
        job.location = updateDTO.location ?? job.location;
        job.description = updateDTO.description ?? job.description;

        return await this.saveJobUseCase.execute(job);
    }
}
