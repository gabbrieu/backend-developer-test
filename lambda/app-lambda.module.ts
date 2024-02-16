import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Job } from '../src/jobs/entities/job.entity';
import { JobsModule } from '../src/jobs/jobs.module';
import { AppLambdaService } from './app-lambda-service';
import { AppLambdaController } from './app-lambda.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: Number(process.env.DATABASE_PORT) || 5432,
            username: process.env.DATABASE_USERNAME || 'root',
            password: process.env.DATABASE_PASSWORD || 'root',
            database: process.env.DATABASE_NAME || 'app',
            entities: [join(__dirname, '..', 'src', '**', '*.entity.{ts,js}')],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Job]),
        JobsModule,
    ],
    controllers: [AppLambdaController], // TODO: REMOVE CONTROLLER
    providers: [AppLambdaService],
})
export class AppLambdaModule {}
