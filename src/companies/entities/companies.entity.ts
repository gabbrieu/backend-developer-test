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
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'now()',
    })
    created_at: string;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'now()',
    })
    updated_at: string;
}
