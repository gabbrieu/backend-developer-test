import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './controller/jobs.controller';
import { Job } from './entities/job.entity';
import { JobRepository } from './repository/job.repository';
import { ArchiveJobUseCase } from './use-cases/archive-job.use-case';
import { CreateJobUseCase } from './use-cases/create-job.use-case';
import { FindOneJobUseCase } from './use-cases/find-one-job.use-case';
import { PublishOneJobUseCase } from './use-cases/publish-one-job.use-case';
import { SaveJobUseCase } from './use-cases/save-job.use-case';
import { UpdateJobUseCase } from './use-cases/update-job.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([Job])],
    controllers: [JobsController],
    providers: [
        FindOneJobUseCase,
        PublishOneJobUseCase,
        SaveJobUseCase,
        CreateJobUseCase,
        UpdateJobUseCase,
        ArchiveJobUseCase,
        {
            provide: 'IJobRepository',
            useClass: JobRepository,
        },
    ],
})
export class JobsModule {}
