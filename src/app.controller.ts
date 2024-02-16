import { CacheInterceptor } from '@nestjs/cache-manager';
import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FeedJobDTO } from './jobs/dto/feed-job.dto';

@Controller('feed')
@ApiTags('Feed')
@UseInterceptors(CacheInterceptor)
export class AppController {
    constructor(
        @Inject(AppService)
        private readonly appService: AppService
    ) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'S3 file fetched',
    })
    async feed(): Promise<FeedJobDTO[]> {
        return this.appService.feed();
    }
}
