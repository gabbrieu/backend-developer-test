import { Test } from '@nestjs/testing';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';
import { FindAllCompaniesUseCase } from './find-all-companies.use-case';

describe('FindAllCompaniesUseCase', () => {
    let findAllCompaniesUseCase: FindAllCompaniesUseCase;
    let repository: ICompanyRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FindAllCompaniesUseCase,
                {
                    provide: 'ICompanyRepository',
                    useValue: { findAll: () => jest.fn() },
                },
            ],
        }).compile();

        findAllCompaniesUseCase = module.get<FindAllCompaniesUseCase>(
            FindAllCompaniesUseCase
        );
        repository = module.get('ICompanyRepository');
    });

    describe('execute', () => {
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

            jest.spyOn(repository, 'findAll').mockResolvedValue(result);

            const response = await findAllCompaniesUseCase.execute();

            expect(response).toStrictEqual(result);
        });

        it('should return an empty array when does not exist any company', async () => {
            const result: Company[] = [];

            jest.spyOn(repository, 'findAll').mockResolvedValue(result);

            const response = await findAllCompaniesUseCase.execute();

            expect(response).toHaveLength(0);
            expect(response).toStrictEqual(result);
        });
    });
});
