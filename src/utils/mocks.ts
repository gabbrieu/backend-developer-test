import { EJobStatus, Job } from '../jobs/entities/job.entity';

interface JobMockOptions {
    status?: EJobStatus;
    title?: string;
    description?: string;
    location?: string;
}

export const makeJobMock = (options: JobMockOptions = {}): Job => {
    const {
        status = EJobStatus.DRAFT,
        title = 'Job title',
        description = 'Job description',
        location = 'Belo Horizonte',
    } = options;

    return {
        id: 'uuid',
        title,
        company: {
            id: 'company uuid',
            name: 'Company test',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
        },
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        description,
        location,
        status,
    };
};
