import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';

export const s3Client = new S3Client({
    apiVersion: 'latest',
    region: process.env.AWS_S3_REGION ?? 'sa-east-1',
});

export const sqsClient = new SQSClient({
    apiVersion: 'latest',
    region: process.env.AWS_S3_REGION ?? 'sa-east-1',
});
