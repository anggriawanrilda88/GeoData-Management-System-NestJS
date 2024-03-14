import { Test, TestingModule } from '@nestjs/testing';
import { GeoLocationsController } from './geo_locations.controller';
import { GeoLocationsService } from '../../services/geo_locations.service';
import { GeoLocations } from '../../models/geo_locations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateGeoLocationDto } from './dto/create-geo-location.dto';
import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';
import { FindGeoLocationDto } from './dto/find-geo-location.dto';

describe('GeoLocationsController', () => {
  let controller: GeoLocationsController;
  const mockGeoLocationService = {
    saveMultipleData: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoLocationsController],
      providers: [
        {
          provide: GeoLocationsService,
          useValue: mockGeoLocationService,
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
            generateToken: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            getRoles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GeoLocationsController>(GeoLocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create geo location and delete photos', async () => {
    const file: any = {
      path: '/path/to/file',
    };
    const req: any = {
      geoLocationData: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [125.6, 10.1] }, properties: { name: 'Test Location' } }],
    };

    jest.spyOn(mockGeoLocationService, 'saveMultipleData').mockResolvedValueOnce(null);

    const fsMock = {
      existsSync: jest.fn().mockReturnValueOnce(true),
      unlinkSync: jest.fn(),
    };
    jest.mock('fs', () => fsMock);

    const data = await controller.create(file, req);
    expect(data.data.message).toEqual('Successfully creates geo location');
  });

  it('should show list geo locations', async () => {
    const findGeoLocationDto = {
      limit: 1,
      keyword: "",
      offset: 0,
      order_by: "id",
      sort_by: "asc"
    } as FindGeoLocationDto;

    const listGeoLocation = {
      count: 1,
      data: [
        {
          "id": 3,
          "type": "Feature",
          "geometry_type": "Point",
          "geometry_coordinates_lat": "125.6",
          "geometry_coordinates_long": "10.1",
          "properties_name": "Dinagat Islands"
        } as any
      ]
    };

    jest.spyOn(mockGeoLocationService, 'find').mockReturnValue(listGeoLocation);

    const result = await controller.find(findGeoLocationDto);
    expect(result).toEqual(listGeoLocation);
  });
});