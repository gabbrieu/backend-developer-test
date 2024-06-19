import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { FeedJobDTO } from '../dto/feed-job.dto';
import { GetFeedJobsOnS3UseCase } from '../use-cases/get-feed-jobs-on-s3.use-case';
import { FeedController } from './feed.controller';

describe('FeedController', () => {
    let feedController: FeedController;
    let getFeedJobsOnS3UseCase: GetFeedJobsOnS3UseCase;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [CacheModule.register()],
            controllers: [FeedController],
            providers: [
                GetFeedJobsOnS3UseCase,
                { provide: ConfigService, useValue: {} },
            ],
        }).compile();

        feedController = module.get<FeedController>(FeedController);
        getFeedJobsOnS3UseCase = module.get<GetFeedJobsOnS3UseCase>(
            GetFeedJobsOnS3UseCase
        );
    });

    describe('feed', () => {
        it('should return all jobs stored in S3', async () => {
            const result: FeedJobDTO[] = [
                {
                    id: 'uuid 1',
                    companyName: 'Company name test',
                    created_at: '2024-01-01',
                    description: 'Description test',
                    title: 'Title test',
                },
                {
                    id: 'uuid 2',
                    companyName: 'Company name test 2',
                    created_at: '2024-02-02',
                    description: 'Description test 2',
                    title: 'Title test 2',
                },
            ];

            jest.spyOn(getFeedJobsOnS3UseCase, 'execute').mockResolvedValue(
                result
            );

            const response = await feedController.feed();

            expect(response).toStrictEqual(result);
        });
    });
});
