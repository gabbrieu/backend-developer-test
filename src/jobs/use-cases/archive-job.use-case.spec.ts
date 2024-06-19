import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { ArchiveJobUseCase } from './archive-job.use-case';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

describe('ArchiveJobUseCase', () => {
    let archiveJobUseCase: ArchiveJobUseCase;
    let findOneJobUseCase: FindOneJobUseCase;
    let saveJobUseCase: SaveJobUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ArchiveJobUseCase,
                FindOneJobUseCase,
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        }).compile();

        archiveJobUseCase = module.get<ArchiveJobUseCase>(ArchiveJobUseCase);
        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
    });

    describe('execute', () => {
        it('should archive one job', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.PUBLISHED });

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.ARCHIVED,
            });

            const response = await archiveJobUseCase.execute(job.id);

            expect(response).toStrictEqual({
                ...job,
                status: EJobStatus.ARCHIVED,
            });
        });

        it('should throw a FORBIDDEN_ERROR when the status job is different than published', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.DRAFT });

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);

            archiveJobUseCase.execute(job.id).catch((e) => {
                expect(e).toBeInstanceOf(ForbiddenException);
                expect(e.message).toEqual(
                    `It is only possible to archive an active job (status flag = "published")`
                );
            });
        });
    });
});
