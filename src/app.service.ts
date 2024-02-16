import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedJobDTO } from './jobs/dto/feed-job.dto';
import { s3Client } from './utils/aws';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {}

    async feed(): Promise<FeedJobDTO[]> {
        try {
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

            return jsonData;
        } catch (error) {
            const message = error?.message ?? error;

            throw new InternalServerErrorException(
                `Something bad happens when trying to retrieve the feed json file from S3: ${message}`
            );
        }
    }
}
