import { Company } from '../entities/companies.entity';

export interface ICompanyRepository {
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company | null>;
}
