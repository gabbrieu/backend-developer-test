import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from '../utils/error.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const useCaseNameRegex = /\b(\w+)\.execute\b/g;
        let match: RegExpExecArray;
        let useCaseName: string;

        while ((match = useCaseNameRegex.exec(exception?.stack)) !== null) {
            useCaseName = match[1];
        }

        if (!useCaseName) {
            useCaseName = 'HttpExceptionFilter';
        }

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception?.message ?? 'Internal server error';

        const devErrorResponse: IErrorResponse = {
            message: exception?.message,
            errorName: exception?.name,
            statusCode,
            method: request.method,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        const prodErrorResponse = {
            message,
            statusCode,
        };

        const logger = new Logger(useCaseName);
        logger.error(
            `ERROR in ${request.method} request URL ${request.url}: ${message}`
        );

        response
            .status(statusCode)
            .json(
                process.env.NODE_ENV === 'development'
                    ? devErrorResponse
                    : prodErrorResponse
            );
    }
}
