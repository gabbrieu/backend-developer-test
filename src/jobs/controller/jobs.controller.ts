import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Inject,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaveJobDTO } from '../dto/save-job.dto';
import { Job } from '../entities/job.entity';
import { CreateJobUseCase } from '../use-cases/create-job-use-case';
import { PublishOneJobUseCase } from '../use-cases/publish-one-job.use-case';

@Controller('job')
@ApiTags('Jobs')
@ApiExtraModels(Job)
export class JobsController {
    constructor(
        @Inject(PublishOneJobUseCase)
        private readonly publishOneJobUseCase: PublishOneJobUseCase,

        @Inject(CreateJobUseCase)
        private readonly createJobUseCase: CreateJobUseCase
    ) {}

    @Post()
    @HttpCode(201)
    @ApiResponse({
        status: 201,
        description: 'Job  successfully created',
    })
    async create(@Body() createDTO: SaveJobDTO): Promise<Job> {
        return this.createJobUseCase.execute(createDTO);
    }

    @Put(':job_id/publish')
    @ApiResponse({
        status: 200,
        description: 'Job successfully published',
    })
    @ApiResponse({
        status: 404,
        description: 'Job not found',
    })
    async publish(@Param('job_id') id: string): Promise<Job> {
        return this.publishOneJobUseCase.execute(id);
    }

    @Put(':job_id')
    async update(@Param('job_id') id: string) {}

    @Put(':job_id/archive')
    async archive(@Param('job_id') id: string) {}

    @Delete(':job_id')
    async delete(@Param('job_id') id: string) {}
}
