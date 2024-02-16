import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class FindOneJobUseCase {
    private readonly logger = new Logger(FindOneJobUseCase.name);

    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(params: FindOneOptions<Job>): Promise<Job> {
        this.logger.log(
            `Finding one job with params: ${JSON.stringify(params)}`
        );

        const job: Job | null = await this.jobRepository.findOne(params);

        if (!job) {
            throw new NotFoundException('Job does not exist');
        }

        return job;
    }
}
