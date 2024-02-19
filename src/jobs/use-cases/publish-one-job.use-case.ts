import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sqsClient } from '../../utils/aws';
import { CheckHarmfulContentDTO } from '../dto/check-harmful-content.dto';
import { PublishJobResponseDTO } from '../dto/publish-job.dto';
import { EJobStatus, Job } from '../entities/job.entity';
import { FindOneJobUseCase } from './find-one-job.use-case';

@Injectable()
export class PublishOneJobUseCase {
    private readonly logger = new Logger(FindOneJobUseCase.name);

    constructor(
        @Inject(FindOneJobUseCase)
        private readonly findOneJobUseCase: FindOneJobUseCase,

        private readonly configService: ConfigService
    ) {}

    async execute(id: string): Promise<PublishJobResponseDTO> {
        this.logger.log(`Publishing one job by id: ${id}`);

        const job: Job = await this.findOneJobUseCase.execute({
            where: { id },
            relations: { company: true },
        });

        if (job.status !== EJobStatus.DRAFT) {
            throw new ForbiddenException(
                `It is only possible to publish a job with "draft" status`
            );
        }

        await this._sendJobToSQS(job);

        return {
            message: 'Job succesfully sent to check harmful content',
        };
    }

    private async _sendJobToSQS(job: Job): Promise<void> {
        this.logger.log('Sending job to SQS to check harmful content');

        const queueURL: string =
            this.configService.getOrThrow<string>('AWS_SQS_URL');

        const command = new SendMessageCommand({
            MessageBody: this._formatJobToSendToSQS(job),
            QueueUrl: queueURL,
        });

        await sqsClient.send(command);
        this.logger.log('Job succesfully sent to SQS');
    }

    private _formatJobToSendToSQS(job: Job): string {
        return JSON.stringify({
            id: job.id,
            title: job.title,
            description: job.description,
        } as CheckHarmfulContentDTO);
    }
}
