import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Users } from './src/models/users.entity';
import { GeoLocations } from './src/models/geo_locations.entity';

config();

const configService = new ConfigService();

// this is connection for command database
export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('PG1_HOST'),
  port: configService.getOrThrow('PG1_PORT'),
  database: configService.getOrThrow('PG1_DATABASE'),
  username: configService.getOrThrow('PG1_USERNAME'),
  password: configService.getOrThrow('PG1_PASSWORD'),
  migrations: ['migrations/**'],
  entities: [Users, GeoLocations],
});
