import { Inject, Injectable, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class FindJobsUseCase {
    private readonly logger = new Logger(FindJobsUseCase.name);

    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(options?: FindManyOptions<Job>): Promise<Job[]> {
        this.logger.log(
            `Finding jobs with options: ${JSON.stringify(options)}`
        );

        return this.jobRepository.find(options);
    }
}
