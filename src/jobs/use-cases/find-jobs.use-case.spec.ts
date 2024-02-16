import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';
import { FindJobsUseCase } from './find-jobs.use-case';

describe('FindJobsUseCase', () => {
    let findJobsUseCase: FindJobsUseCase;
    let repository: IJobRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FindJobsUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: { find: jest.fn() },
                },
            ],
        }).compile();

        findJobsUseCase = module.get<FindJobsUseCase>(FindJobsUseCase);
        repository = module.get<IJobRepository>('IJobRepository');
    });

    describe('execute', () => {
        it('should return an array of jobs', async () => {
            const job1: Job = makeJobMock({ status: EJobStatus.PUBLISHED });
            const job2: Job = makeJobMock({
                status: EJobStatus.DRAFT,
                description: 'job2 description',
            });

            jest.spyOn(repository, 'find').mockResolvedValue([job1, job2]);

            const result = await findJobsUseCase.execute({
                where: { status: EJobStatus.PUBLISHED },
            });

            expect(result).toStrictEqual([job1, job2]);
        });
    });
});
