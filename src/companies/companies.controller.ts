import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Company } from './entities/companies.entity';
import { FindAllCompaniesUseCase } from './use-cases/find-all-companies.use-case';
import { FindOneCompanyUseCase } from './use-cases/find-one-company.use-case';

@Controller('companies')
export class CompaniesController {
    constructor(
        @Inject(FindAllCompaniesUseCase)
        private readonly findAllCompaniesUseCase: FindAllCompaniesUseCase,

        @Inject(FindOneCompanyUseCase)
        private readonly findOneCompanyUseCase: FindOneCompanyUseCase
    ) {}

    @Get()
    async findAll(): Promise<Company[]> {
        return this.findAllCompaniesUseCase.execute();
    }

    @Get(':company_id')
    async findOne(@Param('company_id') id: string): Promise<Company> {
        return this.findOneCompanyUseCase.execute(id);
    }
}
