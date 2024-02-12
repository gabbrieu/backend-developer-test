import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './entities/companies.entity';
import { FindAllCompaniesUseCase } from './use-cases/find-all-companies.use-case';
import { FindOneCompanyUseCase } from './use-cases/find-one-company.use-case';

@Controller('companies')
@ApiTags('Companies')
@ApiExtraModels(Company)
export class CompaniesController {
    constructor(
        @Inject(FindAllCompaniesUseCase)
        private readonly findAllCompaniesUseCase: FindAllCompaniesUseCase,

        @Inject(FindOneCompanyUseCase)
        private readonly findOneCompanyUseCase: FindOneCompanyUseCase
    ) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Existent companies',
    })
    async findAll(): Promise<Company[]> {
        return this.findAllCompaniesUseCase.execute();
    }

    @Get(':company_id')
    @ApiResponse({
        status: 200,
        description: 'Company found by id',
    })
    @ApiResponse({
        status: 404,
        description: 'Company not found by id',
    })
    async findOne(@Param('company_id') id: string): Promise<Company> {
        return this.findOneCompanyUseCase.execute(id);
    }
}
