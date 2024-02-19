/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppLambdaModule } from '../app-lambda.module';
import { SaveJobFileLambdaService } from './save-job-file-lambda.service';

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    const appContext =
        await NestFactory.createApplicationContext(AppLambdaModule);
    const saveJobFileLambdaService: SaveJobFileLambdaService = appContext.get(
        SaveJobFileLambdaService
    );

    return await saveJobFileLambdaService.saveJobFile();
};
