import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Company } from '../entities/companies.entity';

export interface ICompanyRepository {
    find(options?: FindManyOptions<Company>): Promise<Company[]>;
    findOne(params: FindOneOptions<Company>): Promise<Company | null>;
}
