import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>
    ) {}

    async findAll(): Promise<Company[]> {
        return await this.companyRepo.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<Company> {
        return await this.companyRepo.findOne({ where: { id } });
    }
}
