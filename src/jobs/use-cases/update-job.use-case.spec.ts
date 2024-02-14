import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { makeJobMock } from '../../utils/mocks';
import { UpdateJobDTO } from '../dto/update-job.dto';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';
import { UpdateJobUseCase } from './update-job.use-case';

describe('UpdateJobUseCase', () => {
    let updateJobUseCase: UpdateJobUseCase;
    let findOneJobUseCase: FindOneJobUseCase;
    let saveJobUseCase: SaveJobUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UpdateJobUseCase,
                FindOneJobUseCase,
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        }).compile();

        updateJobUseCase = module.get<UpdateJobUseCase>(UpdateJobUseCase);
        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
    });

    describe('execute', () => {
        it('should update the job with all fields', async () => {
            const job: Job = makeJobMock();
            const updateDTO: UpdateJobDTO = {
                description: 'Changing description',
                location: 'Changing location',
                title: 'Changing title',
            };

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                ...updateDTO,
            });

            const response = await updateJobUseCase.execute(job.id, updateDTO);

            expect(response).toStrictEqual({
                ...job,
                ...updateDTO,
            });
        });

        it('should update only the job description', async () => {
            const job: Job = makeJobMock();
            const updateDTO: UpdateJobDTO = {
                description: 'Changing description',
            };

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                ...updateDTO,
            });

            const response = await updateJobUseCase.execute(job.id, updateDTO);

            expect(response).toStrictEqual({
                ...job,
                ...updateDTO,
            });
        });

        it('should update only the job title', async () => {
            const job: Job = makeJobMock();
            const updateDTO: UpdateJobDTO = {
                title: 'Changing title',
            };

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                ...updateDTO,
            });

            const response = await updateJobUseCase.execute(job.id, updateDTO);

            expect(response).toStrictEqual({
                ...job,
                ...updateDTO,
            });
        });

        it('should throw a FORBIDDEN_ERROR when the status job is different than draft', async () => {
            const job: Job = makeJobMock({ status: EJobStatus.ARCHIVED });
            const updateDTO: UpdateJobDTO = {
                description: 'Changing description',
                location: 'Changing location',
                title: 'Changing title',
            };

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);

            updateJobUseCase.execute(job.id, updateDTO).catch((e) => {
                expect(e).toBeInstanceOf(ForbiddenException);
                expect(e.message).toEqual(
                    `It is only possible to update a job with "draft" status`
                );
            });
        });
    });
});
