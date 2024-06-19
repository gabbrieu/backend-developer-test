import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IErrorResponse } from '../../utils/error.interface';
import { Company } from '../entities/companies.entity';
import { FindCompaniesUseCase } from '../use-cases/find-companies.use-case';
import { FindOneCompanyUseCase } from '../use-cases/find-one-company.use-case';

@Controller('companies')
@ApiTags('Companies')
@ApiExtraModels(Company)
export class CompaniesController {
    constructor(
        @Inject(FindCompaniesUseCase)
        private readonly findCompaniesUseCase: FindCompaniesUseCase,

        @Inject(FindOneCompanyUseCase)
        private readonly findOneCompanyUseCase: FindOneCompanyUseCase
    ) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Existent companies',
        type: Company,
        isArray: true,
    })
    @ApiOperation({
        summary: 'Finds all companies',
    })
    async findAll(): Promise<Company[]> {
        return this.findCompaniesUseCase.execute({ order: { name: 'ASC' } });
    }

    @Get(':company_id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Company found by id',
        type: Company,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Company not found by id',
        type: IErrorResponse,
    })
    @ApiOperation({
        summary: 'Finds one company by ID',
    })
    async findOne(@Param('company_id') id: string): Promise<Company> {
        return this.findOneCompanyUseCase.execute({ where: { id } });
    }
}
