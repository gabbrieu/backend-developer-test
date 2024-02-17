import { CacheInterceptor } from '@nestjs/cache-manager';
import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedJobDTO } from '../dto/feed-job.dto';
import { GetFeedJobsOnS3UseCase } from '../use-cases/get-feed-jobs-on-s3.use-case';

@Controller('feed')
@ApiTags('Feed')
@UseInterceptors(CacheInterceptor)
export class FeedController {
    constructor(
        @Inject(GetFeedJobsOnS3UseCase)
        private readonly getFeedJobsOnS3UseCase: GetFeedJobsOnS3UseCase
    ) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'S3 file fetched',
    })
    @ApiOperation({
        summary: 'Returns the feed jobs from S3 with status = PUBLISHED',
        description: 'The cache TTL is 30s',
    })
    async feed(): Promise<FeedJobDTO[]> {
        return this.getFeedJobsOnS3UseCase.execute();
    }
}
