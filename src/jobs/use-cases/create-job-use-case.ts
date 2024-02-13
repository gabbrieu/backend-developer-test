import { Inject } from '@nestjs/common';
import { SaveJobDTO } from '../dto/save-job.dto';
import { Job } from '../entities/job.entity';
import { SaveJobUseCase } from './save-job.use-case';

export class CreateJobUseCase {
    constructor(
        @Inject(SaveJobUseCase)
        private readonly saveJobUseCase: SaveJobUseCase
    ) {}

    async execute(createDTO: SaveJobDTO): Promise<Job> {
        return await this.saveJobUseCase.execute({
            ...createDTO,
            company: { id: createDTO.companyId },
        });
    }
}
