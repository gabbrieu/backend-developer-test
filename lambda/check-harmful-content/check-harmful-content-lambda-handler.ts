/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler, SQSEvent } from 'aws-lambda';
import { AppLambdaModule } from '../app-lambda.module';
import { CheckHarmfulContentLambdaService } from './check-harmful-content-lambda.service';

export const handler: Handler = async (
    event: SQSEvent,
    _context: Context,
    _callback: Callback
) => {
    const appContext =
        await NestFactory.createApplicationContext(AppLambdaModule);
    const checkHarmfulContentLambdaService: CheckHarmfulContentLambdaService =
        appContext.get(CheckHarmfulContentLambdaService);

    return await checkHarmfulContentLambdaService.checkHarmfulContent(event);
};
