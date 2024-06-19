import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Company } from '../entities/companies.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';
import { FindOneCompanyUseCase } from './find-one-company.use-case';

describe('FindOneCompanyUseCase', () => {
    let findOneCompanyUseCase: FindOneCompanyUseCase;
    let repository: ICompanyRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FindOneCompanyUseCase,
                {
                    provide: 'ICompanyRepository',
                    useValue: { findOne: () => jest.fn() },
                },
            ],
        }).compile();

        findOneCompanyUseCase = module.get<FindOneCompanyUseCase>(
            FindOneCompanyUseCase
        );
        repository = module.get('ICompanyRepository');
    });

    describe('execute', () => {
        it('should return one company by id', async () => {
            const result: Company = {
                id: 'uuid',
                name: 'test 1',
                created_at: '2024-01-01',
                updated_at: '2024-01-01',
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(result);

            const response = await findOneCompanyUseCase.execute({
                where: { id: result.id },
            });

            expect(response).toStrictEqual(result);
        });

        it('should throw a NOT_FOUND_ERROR when a company does not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            findOneCompanyUseCase
                .execute({ where: { id: 'not_existent_uuid' } })
                .catch((e) => {
                    expect(e).toBeInstanceOf(NotFoundException);
                    expect(e.message).toEqual('Company does not exist');
                    expect(e.status).toEqual(404);
                });
        });
    });
});
