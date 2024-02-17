import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { s3Client } from '../../utils/aws';
import { FeedJobDTO } from '../dto/feed-job.dto';

@Injectable()
export class GetFeedJobsOnS3UseCase {
    private readonly logger = new Logger(GetFeedJobsOnS3UseCase.name);

    constructor(private readonly configService: ConfigService) {}

    async execute(): Promise<FeedJobDTO[]> {
        try {
            this.logger.log('Getting job file from S3');

            const bucketName: string = this.configService.getOrThrow<string>(
                'AWS_S3_FEED_BUCKET_NAME'
            );
            const objectKey: string = this.configService.getOrThrow<string>(
                'AWS_S3_FEED_OBJECT_KEY'
            );

            const s3Command: GetObjectCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
            });

            const bucketData: GetObjectCommandOutput =
                await s3Client.send(s3Command);

            const jsonData: FeedJobDTO[] = JSON.parse(
                await bucketData.Body.transformToString('utf-8')
            );

            this.logger.log('File retrieved from S3');

            return jsonData;
        } catch (error) {
            const message = error?.message ?? error;

            throw new InternalServerErrorException(
                `Something bad happens when trying to retrieve the feed json file from S3: ${message}`
            );
        }
    }
}
