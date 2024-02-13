import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class SaveJobUseCase {
    constructor(
        @Inject('IJobRepository')
        private readonly jobRepository: IJobRepository
    ) {}

    async execute(job: DeepPartial<Job>): Promise<Job> {
        return await this.jobRepository.save(job);
    }
}
