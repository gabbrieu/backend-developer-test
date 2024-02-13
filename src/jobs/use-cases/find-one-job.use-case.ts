import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class FindOneJobUseCase {
    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(params: FindOneOptions<Job>): Promise<Job> {
        const job: Job | null = await this.jobRepository.findOne(params);

        if (!job) {
            throw new NotFoundException('Job does not exist');
        }

        return job;
    }
}
