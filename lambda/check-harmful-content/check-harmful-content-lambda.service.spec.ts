import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SQSEvent } from 'aws-lambda';
import { CheckHarmfulContentDTO } from '../../src/jobs/dto/check-harmful-content.dto';
import { EJobStatus, Job } from '../../src/jobs/entities/job.entity';
import { SaveJobUseCase } from '../../src/jobs/use-cases/save-job.use-case';
import { makeJobMock } from '../../src/utils/mocks';
import { openAI } from '../../src/utils/openai';
import { CheckHarmfulContentLambdaService } from './check-harmful-content-lambda.service';

jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {
            moderations: {
                create: jest.fn().mockImplementation(async () => {
                    return jest.fn();
                }),
            },
        };
    });
});

describe('CheckHarmfulContentLambdaService', () => {
    let checkHarmfulContentLambdaService: CheckHarmfulContentLambdaService;
    let saveJobUseCase: SaveJobUseCase;
    let job: Job;
    let dto: CheckHarmfulContentDTO;
    let sqsEvent: SQSEvent;

    console.log = jest.fn();
    console.error = jest.fn();

    beforeEach(async () => {
        jest.clearAllMocks();

        job = makeJobMock();
        dto = {
            id: job.id,
            description: job.description,
            title: job.title,
        };
        sqsEvent = {
            Records: [{ body: JSON.stringify(dto) } as any],
        };

        const module = await Test.createTestingModule({
            providers: [
                CheckHarmfulContentLambdaService,
                ConfigService,
                SaveJobUseCase,
                {
                    provide: 'IJobRepository',
                    useValue: {},
                },
            ],
        })
            .setLogger(console)
            .compile();

        checkHarmfulContentLambdaService =
            module.get<CheckHarmfulContentLambdaService>(
                CheckHarmfulContentLambdaService
            );
        saveJobUseCase = module.get<SaveJobUseCase>(SaveJobUseCase);
    });

    describe('execute', () => {
        it('should publish the job with no harmful content', async () => {
            jest.spyOn(openAI.moderations, 'create').mockResolvedValue({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: false,
                        categories: { harassment: false } as any,
                        category_scores: { harassment: 0 } as any,
                    },
                ],
            });
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.PUBLISHED,
            });

            await expect(
                checkHarmfulContentLambdaService.checkHarmfulContent(sqsEvent)
            ).resolves.not.toThrow();
            expect(openAI.moderations.create).toHaveBeenCalledTimes(2);
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(1, {
                input: job.description,
            });
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(2, {
                input: job.title,
            });
            expect(saveJobUseCase.execute).toHaveBeenCalledTimes(1);
            expect(saveJobUseCase.execute).toHaveBeenCalledWith({
                id: job.id,
                status: EJobStatus.PUBLISHED,
            });
        });

        it('should rejected the job due to harmful content only on description', async () => {
            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: true,
                        categories: { harassment: true } as any,
                        category_scores: { harassment: 1 } as any,
                    },
                ],
            });
            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: false,
                        categories: { harassment: false } as any,
                        category_scores: { harassment: 0 } as any,
                    },
                ],
            });
            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Description content: harassment',
            });

            await expect(
                checkHarmfulContentLambdaService.checkHarmfulContent(sqsEvent)
            ).resolves.not.toThrow();
            expect(openAI.moderations.create).toHaveBeenCalledTimes(2);
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(1, {
                input: job.description,
            });
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(2, {
                input: job.title,
            });
            expect(saveJobUseCase.execute).toHaveBeenCalledTimes(1);
            expect(saveJobUseCase.execute).toHaveBeenCalledWith({
                id: job.id,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Description content: harassment',
            });
        });

        it('should rejected the job due to harmful content only on title', async () => {
            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: false,
                        categories: { harassment: false } as any,
                        category_scores: { harassment: 0 } as any,
                    },
                ],
            });

            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: true,
                        categories: { harassment: true } as any,
                        category_scores: { harassment: 1 } as any,
                    },
                ],
            });

            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Title content: harassment',
            });

            await expect(
                checkHarmfulContentLambdaService.checkHarmfulContent(sqsEvent)
            ).resolves.not.toThrow();
            expect(openAI.moderations.create).toHaveBeenCalledTimes(2);
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(1, {
                input: job.description,
            });
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(2, {
                input: job.title,
            });
            expect(saveJobUseCase.execute).toHaveBeenCalledTimes(1);
            expect(saveJobUseCase.execute).toHaveBeenCalledWith({
                id: job.id,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Title content: harassment',
            });
        });

        it('should rejected the job due to harmful content on description and title', async () => {
            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: true,
                        categories: { hate: true } as any,
                        category_scores: { hate: 1 } as any,
                    },
                ],
            });

            jest.spyOn(openAI.moderations, 'create').mockResolvedValueOnce({
                id: 'uuid',
                model: '',
                results: [
                    {
                        flagged: true,
                        categories: { harassment: true } as any,
                        category_scores: { harassment: 1 } as any,
                    },
                ],
            });

            jest.spyOn(saveJobUseCase, 'execute').mockResolvedValue({
                ...job,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Description content: hate. Title content: harassment',
            });

            await expect(
                checkHarmfulContentLambdaService.checkHarmfulContent(sqsEvent)
            ).resolves.not.toThrow();
            expect(openAI.moderations.create).toHaveBeenCalledTimes(2);
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(1, {
                input: job.description,
            });
            expect(openAI.moderations.create).toHaveBeenNthCalledWith(2, {
                input: job.title,
            });
            expect(saveJobUseCase.execute).toHaveBeenCalledTimes(1);
            expect(saveJobUseCase.execute).toHaveBeenCalledWith({
                id: job.id,
                status: EJobStatus.REJECTED,
                notes: 'Rejected due to harmful content. Description content: hate. Title content: harassment',
            });
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens', async () => {
            const errorMessage: string = 'AWS_S3_FEED_BUCKET_NAME is not set';

            jest.spyOn(openAI.moderations, 'create').mockImplementation(() => {
                throw new Error(errorMessage);
            });

            checkHarmfulContentLambdaService
                .checkHarmfulContent(sqsEvent)
                .catch((e) => {
                    expect(e).toBeInstanceOf(InternalServerErrorException);
                    expect(e.message).toEqual(
                        `Something bad happens when checking harmful content: ${errorMessage}`
                    );
                });
        });

        it('should throw a INTERNAL_SERVER_ERROR when something bad happens with error object without the message property', async () => {
            jest.spyOn(openAI.moderations, 'create').mockImplementation(() => {
                throw 'AWS_S3_FEED_BUCKET_NAME is not set';
            });

            checkHarmfulContentLambdaService
                .checkHarmfulContent(sqsEvent)
                .catch((e) => {
                    expect(e).toBeInstanceOf(InternalServerErrorException);
                    expect(e.message).toEqual(
                        `Something bad happens when checking harmful content: AWS_S3_FEED_BUCKET_NAME is not set`
                    );
                });
        });
    });
});
