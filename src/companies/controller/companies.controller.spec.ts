import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Company } from '../entities/companies.entity';
import { FindCompaniesUseCase } from '../use-cases/find-companies.use-case';
import { FindOneCompanyUseCase } from '../use-cases/find-one-company.use-case';
import { CompaniesController } from './companies.controller';

describe('CompaniesController', () => {
    let companiesController: CompaniesController;
    let findCompaniesUseCase: FindCompaniesUseCase;
    let findOneCompanyUseCase: FindOneCompanyUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                FindCompaniesUseCase,
                FindOneCompanyUseCase,
                {
                    provide: 'ICompanyRepository',
                    useValue: {},
                },
            ],
        }).compile();

        companiesController =
            module.get<CompaniesController>(CompaniesController);
        findCompaniesUseCase =
            module.get<FindCompaniesUseCase>(FindCompaniesUseCase);
        findOneCompanyUseCase = module.get<FindOneCompanyUseCase>(
            FindOneCompanyUseCase
        );
    });

    describe('findAll', () => {
        it('should return all companies', async () => {
            const result: Company[] = [
                {
                    id: 'uuid',
                    name: 'test 1',
                    created_at: '2024-01-01',
                    updated_at: '2024-01-01',
                },
                {
                    id: 'uuid',
                    name: 'test 2',
                    created_at: '2024-01-02',
                    updated_at: '2024-01-02',
                },
            ];

            jest.spyOn(findCompaniesUseCase, 'execute').mockResolvedValue(
                result
            );

            const response = await companiesController.findAll();

            expect(response).toStrictEqual(result);
        });

        it('should return an empty array when does not exist any company', async () => {
            const result: Company[] = [];

            jest.spyOn(findCompaniesUseCase, 'execute').mockResolvedValue(
                result
            );

            const response = await companiesController.findAll();

            expect(response).toHaveLength(0);
            expect(response).toStrictEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return one company by id', async () => {
            const result: Company = {
                id: 'uuid',
                name: 'test 1',
                created_at: '2024-01-01',
                updated_at: '2024-01-01',
            };

            jest.spyOn(findOneCompanyUseCase, 'execute').mockResolvedValue(
                result
            );

            const response = await companiesController.findOne('uuid');

            expect(response).toStrictEqual(result);
        });

        it('should throw a NOT_FOUND_ERROR when a company does not exist', async () => {
            jest.spyOn(findOneCompanyUseCase, 'execute').mockRejectedValue(
                new NotFoundException('Company does not exist')
            );

            companiesController.findOne('not_existent_uuid').catch((e) => {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toEqual('Company does not exist');
                expect(e.status).toEqual(404);
            });
        });
    });
});
