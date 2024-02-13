import {
    DeepPartial,
    DeleteResult,
    FindOneOptions,
    FindOptionsWhere,
} from 'typeorm';
import { Job } from '../entities/job.entity';

export interface IJobRepository {
    findOne(params: FindOneOptions<Job>): Promise<Job | null>;
    save(job: DeepPartial<Job>): Promise<Job>;
    delete(where: FindOptionsWhere<Job>): Promise<DeleteResult>;
}
