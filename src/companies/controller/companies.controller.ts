import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Company } from '../entities/companies.entity';
import { FindAllCompaniesUseCase } from '../use-cases/find-all-companies.use-case';
import { FindOneCompanyUseCase } from '../use-cases/find-one-company.use-case';

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
        status: HttpStatus.OK,
        description: 'Existent companies',
    })
    @ApiOperation({
        summary: 'Finds all companies',
    })
    async findAll(): Promise<Company[]> {
        return this.findAllCompaniesUseCase.execute();
    }

    @Get(':company_id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Company found by id',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Company not found by id',
    })
    @ApiOperation({
        summary: 'Finds one company by ID',
    })
    async findOne(@Param('company_id') id: string): Promise<Company> {
        return this.findOneCompanyUseCase.execute(id);
    }
}
