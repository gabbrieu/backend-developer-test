import { PickType } from '@nestjs/swagger';
import { Job } from '../entities/job.entity';

export class CheckHarmfulContentDTO extends PickType(Job, [
    'id',
    'title',
    'description',
]) {}
