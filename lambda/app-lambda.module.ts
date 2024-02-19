import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Job } from '../src/jobs/entities/job.entity';
import { JobsModule } from '../src/jobs/jobs.module';
import { CheckHarmfulContentLambdaService } from './check-harmful-content/check-harmful-content-lambda.service';
import { SaveJobFileLambdaService } from './save-job-file/save-job-file-lambda.service';

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
        CacheModule.register({ isGlobal: true, ttl: 30000 }),
        JobsModule,
    ],
    providers: [SaveJobFileLambdaService, CheckHarmfulContentLambdaService],
})
export class AppLambdaModule {}
