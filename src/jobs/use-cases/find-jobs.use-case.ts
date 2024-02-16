import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class FindJobsUseCase {
    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(options?: FindManyOptions<Job>): Promise<Job[]> {
        return this.jobRepository.find(options);
    }
}
