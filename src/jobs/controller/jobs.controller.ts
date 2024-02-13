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
import {
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { SaveJobDTO } from '../dto/save-job.dto';
import { UpdateJobDTO } from '../dto/update-job.dto';
import { Job } from '../entities/job.entity';
import { CreateJobUseCase } from '../use-cases/create-job.use-case';
import { PublishOneJobUseCase } from '../use-cases/publish-one-job.use-case';
import { UpdateJobUseCase } from '../use-cases/update-job.use-case';

@Controller('job')
@ApiTags('Jobs')
@ApiExtraModels(Job)
export class JobsController {
    constructor(
        @Inject(PublishOneJobUseCase)
        private readonly publishOneJobUseCase: PublishOneJobUseCase,

        @Inject(CreateJobUseCase)
        private readonly createJobUseCase: CreateJobUseCase,

        @Inject(UpdateJobUseCase)
        private readonly updateJobUseCase: UpdateJobUseCase
    ) {}

    @Post()
    @HttpCode(201)
    @ApiResponse({
        status: 201,
        description: 'Job  successfully created',
    })
    @ApiOperation({
        summary: 'Creates a new job',
        description: 'The related company must exists',
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
    @ApiOperation({
        summary: `Publishes the job (changes the status flag to "published")`,
    })
    async publish(@Param('job_id') id: string): Promise<Job> {
        return this.publishOneJobUseCase.execute(id);
    }

    @Put(':job_id')
    @ApiResponse({
        status: 200,
        description: 'Job successfully updated',
    })
    @ApiResponse({
        status: 400,
        description: 'Error with the body sent',
    })
    @ApiOperation({
        summary: 'Updates the job properties',
    })
    async update(
        @Param('job_id') id: string,
        @Body() updateDTO: UpdateJobDTO
    ): Promise<Job> {
        return this.updateJobUseCase.execute(id, updateDTO);
    }

    @Put(':job_id/archive')
    async archive(@Param('job_id') id: string) {}

    @Delete(':job_id')
    async delete(@Param('job_id') id: string) {}
}
