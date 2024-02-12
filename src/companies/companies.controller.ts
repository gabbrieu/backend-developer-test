import { Controller, Get, Inject, Param } from '@nestjs/common';
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
    async findAll() {
        return this.findAllCompaniesUseCase.execute();
    }

    @Get(':company_id')
    async findOne(@Param('company_id') id: string) {
        return this.findOneCompanyUseCase.execute(id);
    }
}
