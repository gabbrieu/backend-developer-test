import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Job } from '../entities/job.entity';

export class FeedJobDTO extends PickType(Job, [
    'id',
    'title',
    'description',
    'created_at',
]) {
    @IsString()
    @ApiProperty({
        type: String,
        example: 'ABC Corp',
        description: `Company's name`,
    })
    companyName: string;
}
