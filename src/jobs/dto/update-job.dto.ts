import { PartialType, PickType } from '@nestjs/swagger';
import { Job } from '../entities/job.entity';

export class UpdateJobDTO extends PartialType(
    PickType(Job, ['title', 'location', 'description'] as const)
) {}
