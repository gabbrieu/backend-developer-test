import { Test } from '@nestjs/testing';
import { EJobStatus, Job } from '../entities/job.entity';
import { ArchiveJobUseCase } from '../use-cases/archive-job.use-case';
import { CreateJobUseCase } from '../use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../use-cases/delete-job.use-case';
import { FindOneJobUseCase } from '../use-cases/find-one-job.use-case';
import { PublishOneJobUseCase } from '../use-cases/publish-one-job.use-case';
import { SaveJobUseCase } from '../use-cases/save-job.use-case';
import { UpdateJobUseCase } from '../use-cases/update-job.use-case';
import { JobsController } from './jobs.controller';

interface JobMockOptions {
    status?: EJobStatus;
    title?: string;
    description?: string;
    location?: string;
}

const makeJobMock = (options: JobMockOptions = {}): Job => {
    const {
        status = EJobStatus.DRAFT,
        title = 'Job title',
        description = 'Job description',
        location = 'Belo Horizonte',
    } = options;

    return {
        id: 'uuid',
        title,
        company: {
            id: 'company uuid',
            name: 'Company test',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
        },
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        description,
        location,
        status,
    };
};

describe('JobsController', () => {
    let jobsController: JobsController;
    let createJobUseCase: CreateJobUseCase;
    let publishOneJobUseCase: PublishOneJobUseCase;
    let updateJobUseCase: UpdateJobUseCase;
    let archiveJobUseCase: ArchiveJobUseCase;
    let deleteJobUseCase: DeleteJobUseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [JobsController],
            providers: [
                FindOneJobUseCase,
                PublishOneJobUseCase,
                SaveJobUseCase,
                CreateJobUseCase,
                UpdateJobUseCase,
                ArchiveJobUseCase,
                DeleteJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        }).compile();

        jobsController = module.get<JobsController>(JobsController);
        createJobUseCase = module.get<CreateJobUseCase>(CreateJobUseCase);
        publishOneJobUseCase =
            module.get<PublishOneJobUseCase>(PublishOneJobUseCase);
        updateJobUseCase = module.get<UpdateJobUseCase>(UpdateJobUseCase);
        archiveJobUseCase = module.get<ArchiveJobUseCase>(ArchiveJobUseCase);
        deleteJobUseCase = module.get<DeleteJobUseCase>(DeleteJobUseCase);
    });

    describe('create', () => {
        it('should create a job', async () => {
            const jobMock: Job = makeJobMock();

            jest.spyOn(createJobUseCase, 'execute').mockResolvedValue(jobMock);

            const response: Job = await jobsController.create({
                companyId: jobMock.company.id,
                description: jobMock.description,
                location: jobMock.location,
                title: jobMock.title,
            });

            expect(response).toStrictEqual(jobMock);
        });
    });

    describe('publish', () => {
        it('should publish a job', async () => {
            const jobMock: Job = makeJobMock({ status: EJobStatus.PUBLISHED });

            jest.spyOn(publishOneJobUseCase, 'execute').mockResolvedValue(
                jobMock
            );

            const response: Job = await jobsController.publish(jobMock.id);

            expect(response.status).toStrictEqual(EJobStatus.PUBLISHED);
            expect(response).toStrictEqual(jobMock);
        });
    });

    describe('update', () => {
        it('should update a job', async () => {
            const jobMock: Job = makeJobMock();

            jest.spyOn(updateJobUseCase, 'execute').mockResolvedValue(jobMock);

            const response: Job = await jobsController.update(jobMock.id, {
                description: 'job description test',
            });

            expect(response).toStrictEqual(jobMock);
        });
    });

    describe('archive', () => {
        it('should archive a job', async () => {
            const jobMock: Job = makeJobMock({ status: EJobStatus.ARCHIVED });

            jest.spyOn(archiveJobUseCase, 'execute').mockResolvedValue(jobMock);

            const response: Job = await jobsController.archive(jobMock.id);

            expect(response.status).toStrictEqual(EJobStatus.ARCHIVED);
            expect(response).toStrictEqual(jobMock);
        });
    });

    describe('delete', () => {
        it('should delete a job', async () => {
            const jobMock: Job = makeJobMock();

            jest.spyOn(deleteJobUseCase, 'execute').mockResolvedValue();

            await expect(
                jobsController.delete(jobMock.id)
            ).resolves.not.toThrow();
        });
    });
});