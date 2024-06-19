import { Inject, Logger } from '@nestjs/common';
import { SaveJobDTO } from '../dto/save-job.dto';
import { Job } from '../entities/job.entity';
import { SaveJobUseCase } from './save-job.use-case';

export class CreateJobUseCase {
    private readonly logger = new Logger(CreateJobUseCase.name);

    constructor(
        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async execute(createDTO: SaveJobDTO): Promise<Job> {
        this.logger.log(
            `Creating one job with the DTO: ${JSON.stringify(createDTO)}`
        );

        return await this.saveJobUseCase.execute({
            ...createDTO,
            company: { id: createDTO.companyId },
        });
    }
}
