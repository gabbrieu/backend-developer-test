import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';
import { FindOneJobUseCase } from './find-one-job.use-case';

describe('FindOneJobUseCase', () => {
    let findOneJobUseCase: FindOneJobUseCase;
    let repository: IJobRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FindOneJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        repository = module.get<IJobRepository>('IJobRepository');
    });

    describe('execute', () => {
        it('should find a job by id', async () => {
            const job: Job = makeJobMock();

            jest.spyOn(repository, 'findOne').mockResolvedValue(job);

            const result = await findOneJobUseCase.execute({
                where: { id: job.id },
            });

            expect(result).toStrictEqual(job);
        });

        it('should throw a NOT_FOUND_ERROR when the job is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            findOneJobUseCase
                .execute({
                    where: { id: 'id not found' },
                })
                .catch((e) => {
                    expect(e).toBeInstanceOf(NotFoundException);
                    expect(e.message).toEqual('Job does not exist');
                });
        });
    });
});
