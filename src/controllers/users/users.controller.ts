import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from '../../services/users.service';
import { AuthGuard } from '../../auth/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { FindUserDto } from './dto/find-user.dto';
import { Users } from 'src/models/users.entity';
import { RolePathLabel } from '../../auth/auth.decorator';
import { AuthService } from '../../services/auth.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Users API')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    description: 'User logged in successfully', content: {
      example: {
        example: {
          "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gMSIsImVtYWlsIjoiYWRtaW4xQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMDM4OTU1MSwiZXhwIjoxNzEwMzkzMTUxfQ.DpyGDt49fcbFKlSswT7HXjQtGSdNxyffRDKc1-Ct52U"
          }
        }
      }
    },
  })
  @ApiNotFoundResponse({
    description: 'Error password and email', content: {
      example: {
        examples: {
          "Error user not found": {
            value: {
              "message": "User not found.",
              "error": "Not Found",
              "statusCode": 404
            }
          },
          "Error password wrong": {
            value: {
              "message": "Wrong password, try again.",
              "error": "Not Found",
              "statusCode": 404
            }
          }
        }
      }
    }
  })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const data = await this.usersService.findByEmail(body.email);
    if (!data) {
      throw new NotFoundException('User not found.');
    }

    if (data.password !== body.password) {
      throw new NotFoundException('Wrong password, try again.');
    }

    const token = this.authService.generateToken({
      name: data.name,
      email: data.email,
      role: data.role,
    });

    return {
      data: {
        token
      }
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'User List' })
  @ApiOkResponse({
    description: 'Get list user and available for roles admin', content: {
      example: {
        example: {
          "count": 1,
          "data": [
            {
              "user_id": 1,
              "name": "User 1",
              "email": "user1@gmail.com",
              "address": "Jalan Testing Raya 1",
              "created_at": "2024-03-13T00:20:35.543Z",
              "updated_at": "2024-03-13T00:20:35.543Z"
            },
          ]
        }
      }
    },
  })
  @ApiForbiddenResponse({
    description: 'Token empty', content: {
      example: {
        examples: {
          "Token empty": {
            value: {
              "message": "Please provide token",
              "error": "Forbidden",
              "statusCode": 403
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Token invalid', content: {
      example: {
        examples: {
          "Invalid token": {
            value: {
              "message": "Invalid token",
              "error": "Forbidden",
              "statusCode": 403
            }
          },
        }
      }
    }
  })
  @Get('list')
  @UseGuards(AuthGuard)
  @RolePathLabel('user.list')
  async find(@Query() query: FindUserDto) {
    const data = await this.usersService.find(
      query.limit,
      query.offset,
      query.sort_by.toUpperCase() as any,
      query.order_by,
      query.keyword,
    );

    return {
      count: data.count,
      data: data.data.map((val: Users) => {
        return {
          user_id: val.id,
          name: val.name,
          email: val.email,
          address: val.address,
          created_at: val.created_at,
          updated_at: val.updated_at,
        }
      })
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Detail' })
  @ApiOkResponse({
    description: 'Get detail user and available for roles user and admin', content: {
      example: {
        example: {
          "data": {
            "user_id": 1,
            "name": "User 1",
            "email": "user1@gmail.com",
            "address": "Jalan Testing Raya 1",
            "role": "user"
          }
        }
      }
    },
  })
  @ApiForbiddenResponse({
    description: 'Token empty', content: {
      example: {
        examples: {
          "Token empty": {
            value: {
              "message": "Please provide token",
              "error": "Forbidden",
              "statusCode": 403
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Token invalid', content: {
      example: {
        examples: {
          "Invalid token": {
            value: {
              "message": "Invalid token",
              "error": "Forbidden",
              "statusCode": 403
            }
          },
        }
      }
    }
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  @RolePathLabel('user.detail')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(Number(id));

    if (!data) {
      throw new NotFoundException('User not found.');
    }

    return {
      data: {
        user_id: data.id,
        name: data.name,
        email: data.email,
        address: data.address,
        role: data.role
      }
    }
  }
}
