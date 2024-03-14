import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FindGeoLocationDto } from './dto/find-geo-location.dto';
import { GeoLocations } from 'src/models/geo_locations.entity';
import { Label } from 'src/auth/auth.decorator';
import { GeoLocationsService } from 'src/services/geo_locations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeoJSONInterceptor } from './geojson.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

const storage = diskStorage({
  destination: './storage/geo-locations',
  filename: (req, file, callback) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiTags('Geo Locations API')
@Controller('api/geo-locations')
export class GeoLocationsController {
  constructor(
    private readonly geoLocationsService: GeoLocationsService,
  ) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Geo Location' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Geo location Create successfully', content: {
      example: {
        example: {
          "data": {
            "message": "Successfully creates geo location"
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
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage }), GeoJSONInterceptor)
  @Label('geo-locations.create')
  async create(@UploadedFile() file: Express.Multer.File, @Req() req) {
    await this.geoLocationsService.saveMultipleData(req.geoLocationData);
    this.deletePhotos(file.path);

    return {
      data: {
        message: "Successfully creates geo location"
      }
    };
  }

  private deletePhotos(photosPath: string) {
    const photoPaths = photosPath.split(',');

    // Delete each image file in the folder
    photoPaths.forEach(photoPath => {
      const fullPath = "./" + photoPath;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Geo Location' })
  @ApiOkResponse({
    description: 'Geo location Create successfully', content: {
      example: {
        example: {
          "count": 1,
          "data": [
            {
              "id": 2,
              "type": "Feature",
              "geometry_type": "Point",
              "geometry_coordinates_lat": "125.6",
              "geometry_coordinates_long": "10.1",
              "properties_name": "Dinagat Islands"
            }
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
  @Get()
  @UseGuards(AuthGuard)
  @Label('geo-locations.list')
  async find(@Query() query: FindGeoLocationDto) {
    const data = await this.geoLocationsService.find(
      query.limit,
      query.offset,
      query.sort_by.toUpperCase() as any,
      query.order_by,
      query.keyword,
    );

    return {
      count: data.count,
      data: data.data.map((val: GeoLocations) => {
        return {
          id: val.id,
          type: val.type,
          geometry_type: val.geometry_type,
          geometry_coordinates_lat: val.geometry_coordinates_lat,
          geometry_coordinates_long: val.geometry_coordinates_long,
          properties_name: val.properties_name,
        }
      })
    };
  }
}
