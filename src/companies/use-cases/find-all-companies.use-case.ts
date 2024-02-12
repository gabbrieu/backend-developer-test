import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class FindAllCompaniesUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository
    ) {}

    execute(): Promise<Company[]> {
        return this.companyRepository.findAll();
    }
}
