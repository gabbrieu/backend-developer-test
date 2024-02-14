import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { PublishOneJobUseCase } from './publish-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

describe('PublishOneJobUseCase', () => {
    let publishOneJobUseCase: PublishOneJobUseCase;
    let findOneJobUseCase: FindOneJobUseCase;
    let saveJobUseCase: SaveJobUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PublishOneJobUseCase,
                FindOneJobUseCase,
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        }).compile();

        publishOneJobUseCase =
            module.get<PublishOneJobUseCase>(PublishOneJobUseCase);
        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
    });

    describe('execute', () => {
        it('should publish one job', async () => {
            const job: Job = makeJobMock();

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.PUBLISHED,
            });

            const response = await publishOneJobUseCase.execute(job.id);

            expect(response).toStrictEqual({
                ...job,
                status: EJobStatus.PUBLISHED,
            });
        });

        it('should throw a FORBIDDEN_ERROR when the status job is different than draft', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.ARCHIVED });

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);

            publishOneJobUseCase.execute(job.id).catch((e) => {
                expect(e).toBeInstanceOf(ForbiddenException);
                expect(e.message).toEqual(
                    `It is only possible to publish a job with "draft" status`
                );
            });
        });
    });
});
