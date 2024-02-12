import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class FindOneCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository
    ) {}

    async execute(id: string): Promise<Company> {
        const company: Company | null =
            await this.companyRepository.findOne(id);

        if (!company) {
            throw new NotFoundException('Company does not exist');
        }

        return company;
    }
}
