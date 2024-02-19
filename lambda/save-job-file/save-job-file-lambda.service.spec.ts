import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import { EJobStatus, Job } from '../../src/jobs/entities/job.entity';
import { FindJobsUseCase } from '../../src/jobs/use-cases/find-jobs.use-case';
import { makeJobMock } from '../../src/utils/mocks';
import { SaveJobFileLambdaService } from './save-job-file-lambda.service';

describe('SaveJobFileLambdaService', () => {
    let saveJobFileLambdaService: SaveJobFileLambdaService;
    let configService: ConfigService;
    let findJobsUseCase: FindJobsUseCase;

    const s3Mock = mockClient(S3Client);

    console.log = jest.fn();
    console.error = jest.fn();

    beforeEach(async () => {
        s3Mock.reset();

        const module = await Test.createTestingModule({
            providers: [
                SaveJobFileLambdaService,
                ConfigService,
                FindJobsUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        })
            .setLogger(console)
            .compile();

        saveJobFileLambdaService = module.get<SaveJobFileLambdaService>(
            SaveJobFileLambdaService
        );
        configService = module.get<ConfigService>(ConfigService);
        findJobsUseCase = module.get<FindJobsUseCase>(FindJobsUseCase);
    });

    describe('execute', () => {
        it('should save all feed jobs on S3', async () => {
            const job1: Job = makeJobMock({
                status: EJobStatus.PUBLISHED,
                description: 'Description 1',
            });
            const job2: Job = makeJobMock({
                status: EJobStatus.PUBLISHED,
                description: 'Description 2',
            });

            jest.spyOn(configService, 'getOrThrow').mockReturnValue('');
            jest.spyOn(findJobsUseCase, 'execute').mockResolvedValue([
                job1,
                job2,
            ]);

            s3Mock.on(PutObjectCommand).resolves({});

            await expect(
                saveJobFileLambdaService.saveJobFile()
            ).resolves.not.toThrow();
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens', async () => {
            const errorMessage: string = 'AWS_S3_FEED_BUCKET_NAME is not set';

            jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
                throw new Error(errorMessage);
            });

            saveJobFileLambdaService.saveJobFile().catch((e) => {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                expect(e.message).toEqual(
                    `Something bad happens when trying to send the file to S3: ${errorMessage}`
                );
            });
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens with error object without the message property', async () => {
            jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
                throw 'AWS_S3_FEED_BUCKET_NAME is not set';
            });

            saveJobFileLambdaService.saveJobFile().catch((e) => {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                expect(e.message).toEqual(
                    `Something bad happens when trying to send the file to S3: AWS_S3_FEED_BUCKET_NAME is not set`
                );
            });
        });
    });
});
