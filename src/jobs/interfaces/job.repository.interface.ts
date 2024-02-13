import { DeepPartial, FindOneOptions } from 'typeorm';
import { Job } from '../entities/job.entity';

export interface IJobRepository {
    findOne(params: FindOneOptions<Job>): Promise<Job | null>;
    save(job: DeepPartial<Job>): Promise<Job>;
}
