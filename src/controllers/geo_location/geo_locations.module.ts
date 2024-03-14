import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoLocationsController } from './geo_locations.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';

import * as dotenv from 'dotenv';
import { RolesService } from 'src/services/roles.service';
import { GeoLocations } from 'src/models/geo_locations.entity';
import { GeoLocationsService } from 'src/services/geo_locations.service';

dotenv.config(); // Load environment variables from .env file
 
@Module({
  imports: [
    TypeOrmModule.forFeature([GeoLocations]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED }, // Sesuaikan dengan konfigurasi token Anda
    }),
  ],
  controllers: [GeoLocationsController],
  providers: [GeoLocationsService, AuthService, RolesService],
})
export class GeoLocationsModule { }
