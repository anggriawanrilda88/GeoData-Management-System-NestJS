import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateGeoLocationDto {
  file: Express.Multer.File;
}