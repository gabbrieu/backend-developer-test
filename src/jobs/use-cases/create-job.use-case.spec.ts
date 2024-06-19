import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { CreateJobUseCase } from './create-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

describe('CreateJobUseCase', () => {
    let saveJobUseCase: SaveJobUseCase;
    let createJobUseCase: CreateJobUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SaveJobUseCase,
                CreateJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        }).compile();

        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
        createJobUseCase = module.get<CreateJobUseCase>(CreateJobUseCase);
    });

    describe('execute', () => {
        it('should create a job', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.PUBLISHED });

            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue(job);

            const response = await createJobUseCase.execute({
                companyId: job.company.id,
                description: job.description,
                location: job.location,
                title: job.title,
            });

            expect(response).toStrictEqual(job);
        });
    });
});
