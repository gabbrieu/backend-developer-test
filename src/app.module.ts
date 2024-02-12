import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CompaniesModule } from './companies/companies.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'database',
            port: Number(process.env.DATABASE_PORT) || 5432,
            username: process.env.DATABASE_USERNAME || 'root',
            password: process.env.DATABASE_PASSWORD || 'root',
            database: process.env.DATABASE_NAME || 'app',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true,
        }),
        CompaniesModule,
    ],
})
export class AppModule {}
