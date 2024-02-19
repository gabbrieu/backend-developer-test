import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/companies.entity';

export enum EJobStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    REJECTED = 'rejected',
}

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        format: 'uuid',
        example: '94f9b58d-5e9d-46a4-8d3b-2a0327f4c889',
        description: 'UUID of a job',
    })
    @IsUUID()
    id: string;

    @ManyToOne(() => Company, (company) => company.jobs, { nullable: false })
    @JoinColumn({ name: 'company_id' })
    @ApiProperty({
        type: String,
        name: 'company_id',
        format: 'uuid',
        description: 'Company ID',
        example: '94f9b58d-5e9d-46a4-8d3b-2a0327f4c889',
    })
    company: Company;

    @Column({ type: 'text' })
    @ApiProperty({
        type: String,
        example: 'Computer Engineer job',
        description: 'The job title',
    })
    @IsString()
    title: string;

    @Column({ type: 'text' })
    @ApiProperty({
        type: String,
        example: 'A job that do some stuffs',
        description: 'Description of the job',
    })
    @IsString()
    description: string;

    @Column({ type: 'text' })
    @ApiProperty({
        type: String,
        example: 'Brazil',
        description: 'Location of the job',
    })
    @IsString()
    location: string;

    @Column({ type: 'text', nullable: true })
    @ApiPropertyOptional({
        type: String,
        example: 'A big note about the job',
        description: 'Note about the jobs',
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @Column({
        type: 'enum',
        enum: EJobStatus,
        enumName: 'job_status',
        default: EJobStatus.DRAFT,
    })
    @ApiProperty({
        type: EJobStatus,
        enum: EJobStatus,
        enumName: 'job_status',
        example: EJobStatus.ARCHIVED,
        default: EJobStatus.DRAFT,
        description: 'Status of a job',
    })
    @IsEnum(EJobStatus)
    status: EJobStatus;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'now()',
    })
    @ApiProperty({
        type: String,
        example: '2024-02-12T02:55:32.443Z',
        description: `Date of company creation`,
        default: 'now()',
    })
    @IsDateString()
    created_at: string;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'now()',
    })
    @ApiProperty({
        type: String,
        example: '2024-02-12T02:55:32.443Z',
        description: `Date of company update`,
        default: 'now()',
    })
    @IsDateString()
    updated_at: string;
}
