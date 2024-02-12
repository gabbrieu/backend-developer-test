import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './controller/companies.controller';
import { Company } from './entities/companies.entity';
import { CompanyRepository } from './repository/company.repository';
import { FindAllCompaniesUseCase } from './use-cases/find-all-companies.use-case';
import { FindOneCompanyUseCase } from './use-cases/find-one-company.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    controllers: [CompaniesController],
    providers: [
        FindAllCompaniesUseCase,
        FindOneCompanyUseCase,
        {
            provide: 'ICompanyRepository',
            useClass: CompanyRepository,
        },
    ],
})
export class CompaniesModule {}
