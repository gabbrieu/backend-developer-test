import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './controller/feed.controller';
import { JobsController } from './controller/jobs.controller';
import { Job } from './entities/job.entity';
import { JobRepository } from './repository/job.repository';
import { ArchiveJobUseCase } from './use-cases/archive-job.use-case';
import { CreateJobUseCase } from './use-cases/create-job.use-case';
import { DeleteJobUseCase } from './use-cases/delete-job.use-case';
import { FindJobsUseCase } from './use-cases/find-jobs.use-case';
import { FindOneJobUseCase } from './use-cases/find-one-job.use-case';
import { GetFeedJobsOnS3UseCase } from './use-cases/get-feed-jobs-on-s3.use-case';
import { PublishOneJobUseCase } from './use-cases/publish-one-job.use-case';
import { SaveJobUseCase } from './use-cases/save-job.use-case';
import { UpdateJobUseCase } from './use-cases/update-job.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Job])],
    controllers: [JobsController, FeedController],
    providers: [
        FindOneJobUseCase,
        PublishOneJobUseCase,
        SaveJobUseCase,
        CreateJobUseCase,
        UpdateJobUseCase,
        ArchiveJobUseCase,
        DeleteJobUseCase,
        FindJobsUseCase,
        GetFeedJobsOnS3UseCase,
        {
            provide: 'IJobRepository',
            useClass: JobRepository,
        },
    ],
    exports: [FindJobsUseCase, SaveJobUseCase],
})
export class JobsModule {}
