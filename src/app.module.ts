import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST_API || 'database',
            port: Number(process.env.DATABASE_PORT) || 5432,
            username: process.env.DATABASE_USERNAME || 'root',
            password: process.env.DATABASE_PASSWORD || 'root',
            database: process.env.DATABASE_NAME || 'app',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true,
        }),
        CacheModule.register({ isGlobal: true, ttl: 30000 }),
        CompaniesModule,
        JobsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
