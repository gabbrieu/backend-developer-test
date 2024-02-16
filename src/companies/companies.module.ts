import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './controller/companies.controller';
import { Company } from './entities/companies.entity';
import { CompanyRepository } from './repository/company.repository';
import { FindCompaniesUseCase } from './use-cases/find-companies.use-case';
import { FindOneCompanyUseCase } from './use-cases/find-one-company.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    controllers: [CompaniesController],
    providers: [
        FindCompaniesUseCase,
        FindOneCompanyUseCase,
        {
            provide: 'ICompanyRepository',
            useClass: CompanyRepository,
        },
    ],
})
export class CompaniesModule {}
