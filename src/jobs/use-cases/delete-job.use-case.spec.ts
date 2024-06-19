import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { IJobRepository } from '../interfaces/job.repository.interface';
import { DeleteJobUseCase } from './delete-job.use-case';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

describe('DeleteJobUseCase', () => {
    let deleteJobUseCase: DeleteJobUseCase;
    let findOneJobUseCase: FindOneJobUseCase;
    let repository: IJobRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                DeleteJobUseCase,
                FindOneJobUseCase,
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: { delete: jest.fn() },
                },
            ],
        }).compile();

        deleteJobUseCase = module.get<DeleteJobUseCase>(DeleteJobUseCase);
        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        repository = module.get<IJobRepository>('IJobRepository');
    });

    describe('execute', () => {
        it('should delete a job', async () => {
            const job: Job = makeJobMock();

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: 1 });

            await expect(
                deleteJobUseCase.execute(job.id)
            ).resolves.not.toThrow();
            expect(findOneJobUseCase.execute).toHaveBeenCalledTimes(1);
            expect(findOneJobUseCase.execute).toHaveBeenCalledWith({
                where: { id: job.id },
            });
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith({ id: job.id });
        });

        it('should throw a FORBIDDEN_ERROR when the status job is different than draft', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.ARCHIVED });

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);

            deleteJobUseCase.execute(job.id).catch((e) => {
                expect(e).toBeInstanceOf(ForbiddenException);
                expect(e.message).toEqual(
                    `It is only possible to delete a job with "draft" status`
                );
            });
        });
    });
});
