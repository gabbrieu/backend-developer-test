import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        format: 'uuid',
        example: '94f9b58d-5e9d-46a4-8d3b-2a0327f4c889',
        description: 'UUID of a company',
    })
    @IsUUID()
    id: string;

    @Column({ type: 'text', unique: true })
    @ApiProperty({
        type: String,
        example: 'ABC Corp',
        description: `Company's name`,
    })
    @IsString()
    name: string;

    @OneToMany(() => Job, (job) => job.company)
    jobs?: Job[];

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
