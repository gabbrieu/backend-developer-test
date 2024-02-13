import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
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
import { ArchiveJobUseCase } from '../use-cases/archive-job.use-case';
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
        private readonly updateJobUseCase: UpdateJobUseCase,

        @Inject(ArchiveJobUseCase)
        private readonly archiveJobUseCase: ArchiveJobUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
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
        status: HttpStatus.OK,
        description: 'Job successfully published',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Job not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `It is only possible to publish a job with "draft" status`,
    })
    @ApiOperation({
        summary: `Publishes the job (changes the status flag to "published")`,
    })
    async publish(@Param('job_id') id: string): Promise<Job> {
        return this.publishOneJobUseCase.execute(id);
    }

    @Put(':job_id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Job successfully updated',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Error with the body sent',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `It is only possible to update a job with "draft" status`,
    })
    @ApiOperation({
        summary: 'Updates the title, location and description of a job',
    })
    async update(
        @Param('job_id') id: string,
        @Body() updateDTO: UpdateJobDTO
    ): Promise<Job> {
        return this.updateJobUseCase.execute(id, updateDTO);
    }

    @Put(':job_id/archive')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Job successfully archived',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description:
            'It is only possible to archive an active job (status flag = "published")',
    })
    @ApiOperation({
        summary:
            'Archive an active job (changes the status flag to "archived")',
    })
    async archive(@Param('job_id') id: string): Promise<Job> {
        return this.archiveJobUseCase.execute(id);
    }

    @Delete(':job_id')
    async delete(@Param('job_id') id: string) {}
}
