import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class FindOneCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository
    ) {}

    execute(id: string): Promise<Company> {
        return this.companyRepository.findOne(id);
    }
}
