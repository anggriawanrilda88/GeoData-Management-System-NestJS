import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from 'src/services/users.service';
import { Users } from 'src/models/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';

import * as dotenv from 'dotenv';
import { RolesService } from 'src/services/roles.service';

dotenv.config(); // Load environment variables from .env file
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED }, // Sesuaikan dengan konfigurasi token Anda
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, RolesService],
})
export class UsersModule { }
