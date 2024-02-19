import { ApiProperty } from '@nestjs/swagger';

export class PublishJobResponseDTO {
    @ApiProperty({
        description: 'Message that informs the sucess of sent the job to SQS',
        example: 'Job succesfully sent to check harmful content',
    })
    message: string;
}
