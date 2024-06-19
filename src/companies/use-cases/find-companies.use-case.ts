import { Inject, Injectable, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class FindCompaniesUseCase {
    private readonly logger = new Logger(FindCompaniesUseCase.name);

    constructor(
        @Inject('ICompanyRepository')
        private readonly companyRepository: ICompanyRepository
    ) {}

    execute(options?: FindManyOptions<Company>): Promise<Company[]> {
        this.logger.log(
            `Getting companies with options: ${JSON.stringify(options)}`
        );

        return this.companyRepository.find(options);
    }
}
