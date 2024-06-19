import {
    ApiProperty,
    IntersectionType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Job } from '../entities/job.entity';

export class SaveJobDTO extends IntersectionType(
    OmitType(Job, [
        'id',
        'company',
        'created_at',
        'updated_at',
        'status',
    ] as const),
    PartialType(PickType(Job, ['status'] as const))
) {
    @IsUUID()
    @ApiProperty({
        type: String,
        format: 'uuid',
        example: '94f9b58d-5e9d-46a4-8d3b-2a0327f4c889',
        description: 'UUID of a company',
    })
    companyId: string;
}
