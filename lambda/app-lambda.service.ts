import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedJobDTO } from '../src/jobs/dto/feed-job.dto';
import { EJobStatus, Job } from '../src/jobs/entities/job.entity';
import { FindJobsUseCase } from '../src/jobs/use-cases/find-jobs.use-case';
import { s3Client } from '../src/utils/aws';

export class AppLambdaService {
    private readonly logger = new Logger(AppLambdaService.name);

    constructor(
        @Inject(FindJobsUseCase)
        private readonly findJobsUseCase: FindJobsUseCase,
        private readonly configService: ConfigService
    ) {}

    async saveJobFile(): Promise<void> {
        try {
            this.logger.log('Saving jobs file on S3');

            const bucketName: string = this.configService.getOrThrow<string>(
                'AWS_S3_FEED_BUCKET_NAME'
            );
            const objectKey: string = this.configService.getOrThrow<string>(
                'AWS_S3_FEED_OBJECT_KEY'
            );

            const publishedJobs: Job[] = await this.findJobsUseCase.execute({
                where: { status: EJobStatus.PUBLISHED },
                relations: { company: true },
                order: { created_at: 'ASC' },
            });
            const formattedJobs: FeedJobDTO[] =
                this._formatJobsToS3(publishedJobs);

            const s3Command = new PutObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
                Body: JSON.stringify(formattedJobs),
            });

            await s3Client.send(s3Command);

            this.logger.log('Jobs file saved on S3');
        } catch (error) {
            const message = error?.message ?? error;

            throw new InternalServerErrorException(
                `Something bad happens when trying to send the file to S3: ${message}`
            );
        }
    }

    private _formatJobsToS3(jobs: Job[]): FeedJobDTO[] {
        return jobs.map((job) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            companyName: job.company.name,
            created_at: job.created_at,
        }));
    }
}
