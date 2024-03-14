import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.PG1_TYPE as any,
      host: process.env.PG1_HOST,
      port: parseInt(process.env.PG1_PORT, 10),
      database: process.env.PG1_DATABASE,
      username: process.env.PG1_USERNAME,
      password: process.env.PG1_PASSWORD,
      synchronize: true,
      autoLoadEntities: true,
      logging: true
    })
  ],
})
export class DBModule { }
