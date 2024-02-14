import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';
import { SaveJobUseCase } from './save-job.use-case';

describe('SaveJobUseCase', () => {
    let saveJobUseCase: SaveJobUseCase;
    let repository: IJobRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: { save: jest.fn() },
                },
            ],
        }).compile();

        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
        repository = module.get<IJobRepository>('IJobRepository');
    });

    describe('execute', () => {
        it('should save the job', async () => {
            const job: Job = makeJobMock();

            jest.spyOn(repository, 'save').mockResolvedValue(job);

            const result = await saveJobUseCase.execute({
                description: job.description,
            });

            expect(result).toStrictEqual(job);
        });
    });
});
