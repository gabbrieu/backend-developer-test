import { Inject, Injectable, Logger } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class SaveJobUseCase {
    private readonly logger = new Logger(SaveJobUseCase.name);

    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(job: DeepPartial<Job>): Promise<Job> {
        this.logger.log(`Saving one job with params: ${JSON.stringify(job)}`);

        return await this.jobRepository.save(job);
    }
}
