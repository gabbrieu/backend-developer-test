import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class FindOneCompanyUseCase {
    private readonly logger = new Logger(FindOneCompanyUseCase.name);

    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository
    ) {}

    async execute(params: FindOneOptions<Company>): Promise<Company> {
        this.logger.log(
            `Getting one company with params: ${JSON.stringify(params)}`
        );

        const company: Company | null =
            await this.companyRepository.findOne(params);

        if (!company) {
            throw new NotFoundException('Company does not exist');
        }

        return company;
    }
}
