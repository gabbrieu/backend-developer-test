import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { sdkStreamMixin } from '@smithy/util-stream';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'node:stream';
import { makeJobMock } from '../../utils/mocks';
import { EJobStatus, Job } from '../entities/job.entity';
import { GetFeedJobsOnS3UseCase } from './get-feed-jobs-on-s3.use-case';

describe('GetFeedJobsOnS3UseCase', () => {
    let getFeedJobsOnS3UseCase: GetFeedJobsOnS3UseCase;
    let configService: ConfigService;
    const s3Mock = mockClient(S3Client);

    console.log = jest.fn();
    console.error = jest.fn();

    beforeEach(async () => {
        s3Mock.reset();

        const module = await Test.createTestingModule({
            providers: [GetFeedJobsOnS3UseCase, ConfigService],
        })
            .setLogger(console)
            .compile();

        getFeedJobsOnS3UseCase = module.get<GetFeedJobsOnS3UseCase>(
            GetFeedJobsOnS3UseCase
        );
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('execute', () => {
        it('should return all feed jobs from S3', async () => {
            jest.spyOn(configService, 'getOrThrow').mockReturnValue('');

            const stream = new Readable();

            const job1: Job = makeJobMock({
                status: EJobStatus.PUBLISHED,
                description: 'Description 1',
            });
            const job2: Job = makeJobMock({
                status: EJobStatus.PUBLISHED,
                description: 'Description 2',
            });

            stream.push(JSON.stringify([job1, job2]));
            stream.push(null);
            const sdkStream = sdkStreamMixin(stream);

            s3Mock.on(GetObjectCommand).resolves({ Body: sdkStream });

            const result = await getFeedJobsOnS3UseCase.execute();

            expect(result).toStrictEqual([job1, job2]);
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens', async () => {
            const errorMessage: string = 'AWS_S3_FEED_BUCKET_NAME is not set';

            jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
                throw new Error(errorMessage);
            });

            getFeedJobsOnS3UseCase.execute().catch((e) => {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                expect(e.message).toEqual(
                    `Something bad happens when trying to retrieve the feed json file from S3: ${errorMessage}`
                );
            });
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens with error object withou the message property', async () => {
            jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
                throw 'AWS_S3_FEED_BUCKET_NAME is not set';
            });

            getFeedJobsOnS3UseCase.execute().catch((e) => {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                expect(e.message).toEqual(
                    `Something bad happens when trying to retrieve the feed json file from S3: AWS_S3_FEED_BUCKET_NAME is not set`
                );
            });
        });
    });
});
