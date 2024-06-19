import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { SQSEvent } from 'aws-lambda';
import { Moderation, ModerationCreateResponse } from 'openai/resources';
import { CheckHarmfulContentDTO } from '../../src/jobs/dto/check-harmful-content.dto';
import { EJobStatus } from '../../src/jobs/entities/job.entity';
import { SaveJobUseCase } from '../../src/jobs/use-cases/save-job.use-case';
import { openAI } from '../../src/utils/openai';

@Injectable()
export class CheckHarmfulContentLambdaService {
    private readonly logger = new Logger(CheckHarmfulContentLambdaService.name);

    constructor(
        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async checkHarmfulContent(sqsEvent: SQSEvent): Promise<void> {
        try {
            this.logger.log(
                `Receive a message with event: ${JSON.stringify(sqsEvent)}`
            );

            for (const message of sqsEvent.Records) {
                const job: CheckHarmfulContentDTO = JSON.parse(message.body);

                this.logger.log(
                    'Sending title and description to check harmful content'
                );
                const openAIDescriptionResponse: ModerationCreateResponse =
                    await openAI.moderations.create({
                        input: job.description,
                    });
                const openAITitleResponse: ModerationCreateResponse =
                    await openAI.moderations.create({
                        input: job.title,
                    });

                await this._changeStatusBasedOnHarmfulContentResults(
                    job,
                    openAIDescriptionResponse,
                    openAITitleResponse
                );
            }
        } catch (error) {
            const message = error?.message ?? error;

            this.logger.error(
                `Error while checking harmful content: ${message}`
            );

            throw new InternalServerErrorException(
                `Something bad happens when checking harmful content: ${message}`
            );
        }
    }

    private async _changeStatusBasedOnHarmfulContentResults(
        job: CheckHarmfulContentDTO,
        openAIDescriptionResponse: ModerationCreateResponse,
        openAITitleResponse: ModerationCreateResponse
    ): Promise<void> {
        const descriptionResult: Moderation =
            openAIDescriptionResponse.results[0];
        const titleResult: Moderation = openAITitleResponse.results[0];

        const descriptionFlagged: boolean = descriptionResult.flagged;
        const titleFlagged: boolean = titleResult.flagged;

        const descriptionCategories: string[] = Object.keys(
            descriptionResult.categories
        ).filter((category) => descriptionResult.categories[category]);

        const titleCategories: string[] = Object.keys(
            titleResult.categories
        ).filter((category) => titleResult.categories[category]);

        if (!descriptionFlagged && !titleFlagged) {
            await this.saveJobUseCase.execute({
                id: job.id,
                status: EJobStatus.PUBLISHED,
            });

            this.logger.log('Job approved and published!');
        } else {
            let rejectionMessage = 'Rejected due to harmful content';

            if (descriptionFlagged) {
                rejectionMessage += `. Description content: ${descriptionCategories.join(', ')}`;
            }

            if (titleFlagged) {
                rejectionMessage += `. Title content: ${titleCategories.join(', ')}`;
            }

            await this.saveJobUseCase.execute({
                id: job.id,
                status: EJobStatus.REJECTED,
                notes: rejectionMessage,
            });

            this.logger.log('Job rejected!');
        }
    }
}
