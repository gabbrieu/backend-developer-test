import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    DeepPartial,
    DeleteResult,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
} from 'typeorm';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';

@Injectable()
export class JobRepository implements IJobRepository {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepo: Repository<Job>
    ) {}

    async findOne(params: FindOneOptions<Job>): Promise<Job> {
        return await this.jobRepo.findOne(params);
    }

    async save(job: DeepPartial<Job>): Promise<Job> {
        return await this.jobRepo.save(job);
    }

    async delete(where: FindOptionsWhere<Job>): Promise<DeleteResult> {
        return await this.jobRepo.delete(where);
    }
}
