import { ApiProperty } from '@nestjs/swagger';

export class IErrorResponse {
    @ApiProperty({
        description: 'Message that describes the error',
        example: 'Company not found',
    })
    message: string;

    @ApiProperty({
        description: 'Exception error name',
        example: 'NotFoundException',
    })
    errorName: string;

    @ApiProperty({
        description: 'Status code number',
        example: 404,
    })
    statusCode: number;

    @ApiProperty({
        description: 'HTTP method',
        example: 'GET',
    })
    method: string;

    @ApiProperty({
        description: 'Request URL',
        example: '/company',
    })
    path: string;

    @ApiProperty({
        description: 'Timestamp of the error',
        example: '2024-01-01T01:01:01.000000',
    })
    timestamp: string;
}
