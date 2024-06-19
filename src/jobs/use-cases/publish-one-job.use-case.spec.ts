import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import { sqsClient } from '../../utils/aws';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';
import { PublishOneJobUseCase } from './publish-one-job.use-case';
import { SaveJobUseCase } from './save-job.use-case';

describe('PublishOneJobUseCase', () => {
    let publishOneJobUseCase: PublishOneJobUseCase;
    let findOneJobUseCase: FindOneJobUseCase;
    let configService: ConfigService;
    const s3Mock = mockClient(sqsClient);

    console.log = jest.fn();
    console.error = jest.fn();

    beforeEach(async () => {
        s3Mock.reset();

        const module = await Test.createTestingModule({
            providers: [
                PublishOneJobUseCase,
                FindOneJobUseCase,
                SaveJobUseCase,
                ConfigService,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        })
            .setLogger(console)
            .compile();

        publishOneJobUseCase =
            module.get<PublishOneJobUseCase>(PublishOneJobUseCase);
        findOneJobUseCase = module.get<FindOneJobUseCase>(FindOneJobUseCase);
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('execute', () => {
        it('should publish one job', async () => {
            const job: Job = makeJobMock();

            jest.spyOn(findOneJobUseCase, 'execute').mockResolvedValue(job);
            jest.spyOn(configService, 'getOrThrow').mockReturnValue(
                'AWS_SQS_URL'
            );

            s3Mock.on(SendMessageCommand).resolves({});

            const response = await publishOneJobUseCase.execute(job.id);

            expect(response).toStrictEqual({
                message: 'Job succesfully sent to check harmful content',
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
