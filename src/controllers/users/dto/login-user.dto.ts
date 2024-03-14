import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'User email', example: 'user1@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'User password', example: '123456' })
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}