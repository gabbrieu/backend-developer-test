import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        type: String,
        format: 'uuid',
        example: '94f9b58d-5e9d-46a4-8d3b-2a0327f4c889',
        description: 'UUID of a company',
    })
    id: string;

    @Column({ type: 'text', unique: true })
    @ApiProperty({
        type: String,
        example: 'ABC Corp',
        description: `Company's name`,
    })
    name: string;

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
    updated_at: string;
}
