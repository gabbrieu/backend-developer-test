import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
    apiVersion: 'latest',
    region: process.env.AWS_S3_REGION ?? 'sa-east-1',
});
