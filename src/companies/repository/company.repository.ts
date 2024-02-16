import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>
    ) {}

    async find(options?: FindManyOptions<Company>): Promise<Company[]> {
        return await this.companyRepo.find(options);
    }

    async findOne(params: FindOneOptions<Company>): Promise<Company | null> {
        return await this.companyRepo.findOne(params);
    }
}
